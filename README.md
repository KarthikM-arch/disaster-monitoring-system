Project URL:https://disaster-monitoring-system-22.onrender.com
# 🌍 Disaster Monitoring System

A full-stack web application that predicts disaster risk using real-time weather data, displays interactive maps, and provides location-based disaster news alerts.

---

## 🚀 Features

* 🌦️ **Live Weather Data** (temperature, humidity)
* 🤖 **ML-Based Risk Prediction**
* 🗺️ **Interactive Map with Location Pinning**
* 📍 **Current Location Detection**
* 🔎 **City Search Functionality**
* 📊 **Historical Data Visualization (Charts)**
* 📰 **Disaster News (Filtered by Location & Severity)**
* 🔐 **User Authentication (Clerk Login System)**
* 📱 **Responsive UI (Mobile + Desktop)**

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Leaflet (Maps)
* Recharts (Charts)
* Clerk (Authentication)

### Backend

* Flask (Python)
* Scikit-learn (ML Model)
* OpenWeather API
* News API

### Database

* MongoDB Atlas

### Deployment

* Backend → Render
* Frontend → Render / Vercel

---

## 📂 Project Structure

```
disaster-monitoring-system/
│
├── backend/
│   ├── Server.py
│   ├── requirements.txt
│   └── Disaster_Monitoring.pkl
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup

```bash
cd backend
pip install -r requirements.txt
python Server.py
```

Create a `.env` file:

```
API_KEY=your_openweather_api_key
MONGO_URI=your_mongodb_uri
NEWS_API_KEY=your_news_api_key
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_PHONE=your_phone_number
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Create `.env`:

```
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

---

## 🌐 Deployment

### Backend (Render)

* Root Directory: `backend`
* Build Command: `pip install -r requirements.txt`
* Start Command: `python Server.py`

### Frontend (Render/Vercel)

* Root Directory: `frontend`
* Build Command: `npm install && npm run build`
* Publish Directory: `build`

---

## 🔐 Authentication

* Integrated using **Clerk**
* Users must log in to access the dashboard
* Supports sign-in & sign-up flows

---

## 📊 How It Works

1. User logs in 🔐
2. Selects location or searches city 📍
3. App fetches weather data 🌦️
4. ML model predicts disaster risk 🤖
5. Displays:

   * Risk level
   * Weather stats
   * Map location
   * News alerts 📰

---

## 🧠 Machine Learning

* Model: Pre-trained regression/classification model
* Inputs:

  * Temperature
  * Humidity
  * Derived features
* Output:

  * Risk Level (Low / Medium / High)

---

## 🚨 Future Improvements

* 🔔 Push Notifications for alerts
* 📱 Mobile App (React Native)
* 🌐 Custom Domain
* 📡 Real-time disaster alerts (IoT integration)

---

## 👨‍💻 Author

**Karthik M**

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 📢 Share it

---

## 📜 License

This project is open-source and available under the MIT License.
