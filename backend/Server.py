from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import requests
from pymongo import MongoClient
from twilio.rest import Client
import certifi
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔑 Weather API Key

API_KEY = os.getenv("API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
# ---------------------------
# 🗄️ MongoDB Connection
# ---------------------------
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)
db = mongo_client["disaster_db"]
users = db["users"]
predictions = db["predictions"]

# ---------------------------
# 🤖 Load ML Model
# ---------------------------
model = pickle.load(open("Disaster_Monitoring.pkl", "rb"))

# ---------------------------
# 📱 Twilio Config
# ---------------------------
ACCOUNT_SID = os.getenv("TWILIO_SID")
AUTH_TOKEN = os.getenv("TWILIO_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE")

def send_sms(message, phone):
    try:
        twilio_client = Client(ACCOUNT_SID, AUTH_TOKEN)
        twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=phone
        )
        print("✅ SMS sent")
    except Exception as e:
        print("❌ SMS Error:", e)

# ---------------------------
# 🏠 Home
# ---------------------------
@app.route('/')
def home():
    return "✅ Disaster Monitoring Server Running"

# ---------------------------
# 🌦️ PREDICT + STORE + ALERT
# ---------------------------
@app.route('/api/predict-live', methods=['GET'])
def predict_live():
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        email = request.args.get('email')

        if not lat or not lon:
            return jsonify({"error": "Location not provided"}), 400

        # 🌦️ Weather API
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        response = requests.get(url)
        data = response.json()

        if response.status_code != 200:
            return jsonify({"error": data.get("message", "Weather API error")}), 400

        temp = data['main']['temp']
        humidity = data['main']['humidity']
        city = data['name']

        # 🤖 ML Features
        deaths = temp * 2
        affected = humidity * 100
        damage = temp * humidity * 10

        features = [[deaths, affected, damage]]
        prediction = model.predict(features)[0]

        # 🔥 Risk score (for heatmap)
        risk_score = 1 if prediction == "High" else 0.5 if prediction == "Medium" else 0.2

        # 💾 Store in MongoDB
        predictions.insert_one({
            "city": city,
            "temperature": temp,
            "humidity": humidity,
            "risk": prediction,
            "risk_score": risk_score,
            "lat": lat,
            "lon": lon,
            "time": datetime.utcnow()
        })

        # 📊 Confidence
        try:
            confidence = max(model.predict_proba(features)[0])
            confidence = round(confidence * 100, 2)
        except:
            confidence = 0

        # 📱 SMS Alert
        user = users.find_one({"email": email}) if email else None

        if prediction == "High" and user and user.get("phone"):
            send_sms(f"⚠️ ALERT! High risk in {city}", user["phone"])

        return jsonify({
            "city": city,
            "temperature": temp,
            "humidity": humidity,
            "risk": prediction,
            "confidence": confidence,
            "lat": lat,
            "lon": lon
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# 📊 HISTORY API (for charts + map)
# ---------------------------
@app.route('/api/get-history', methods=['GET'])
def get_history():
    try:
        data = list(
            db.predictions.find({}, {"_id": 0})
            .sort("time", -1)
            .limit(50)
        )

        safe_data = []

        for d in data:
            try:
                # ✅ Handle missing or wrong time
                if "time" in d and d["time"]:
                    d["time"] = d["time"].strftime("%H:%M")
                else:
                    d["time"] = "N/A"

                # ✅ Ensure lat/lon are float
                d["lat"] = float(d.get("lat", 0))
                d["lon"] = float(d.get("lon", 0))

                safe_data.append(d)

            except Exception as inner_err:
                print("⚠ Skipping bad record:", inner_err)

        return jsonify(safe_data)

    except Exception as e:
        print("🔥 HISTORY ERROR:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/get-news', methods=['GET'])
def get_news():
    try:
        city = request.args.get('city')

        # 🔥 Strong disaster query
        query = f"{city} (flood OR earthquake OR cyclone OR fire OR landslide OR disaster OR storm)"

        url = f"https://newsapi.org/v2/everything?q={query}&sortBy=publishedAt&language=en&apiKey={NEWS_API_KEY}"

        response = requests.get(url)
        data = response.json()

        articles = data.get("articles", [])

        filtered_news = []

        # 🔍 EXTRA FILTER (important)
        disaster_keywords = ["flood", "earthquake", "cyclone", "fire", "storm", "landslide"]

        for article in articles:
            title = (article.get("title") or "").lower()
            desc = (article.get("description") or "").lower()

            # ✅ Only keep disaster-related
            if any(word in title or word in desc for word in disaster_keywords):
                filtered_news.append({
                    "title": article["title"],
                    "description": article["description"],
                    "url": article["url"],
                    "image": article["urlToImage"]
                })

        return jsonify(filtered_news[:5])  # limit to 5

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ---------------------------
# 🚀 RUN
# ---------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
