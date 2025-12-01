# StockSight

<<<<<<< HEAD
Full Stack Stock Predictor
=======
StockSight is a small full-stack project that shows stock prices, technical indicators, and simple trading signals.
It has:

* a **C++ backend API** (TimescaleDB + libpqxx + httplib)
* a **React frontend** (Vite)

The backend provides:

* `/api/prices`
* `/api/indicators`
* `/api/health`

The frontend displays charts and interacts with those endpoints.

---

## 📁 Project Structure

```
StockSight/
│
├── backend/        → C++ server (API + TimescaleDB connection)
├── frontend/       → React UI
└── README.md       → (this file)
```

---

# 🖥️ Backend (C++ API)

The backend is a lightweight C++ server that connects to TimescaleDB to fetch OHLCV price data and compute indicators (RSI, MACD, Bollinger Bands).

### **Tech Used**

* C++17
* CMake + Ninja
* httplib (HTTP server)
* nlohmann::json
* libpqxx (Postgres client)
* TimescaleDB

### **Requirements / What to Install**

Ubuntu example:

```bash
sudo apt update
sudo apt install cmake g++ ninja-build libpqxx-dev libpq-dev
```

If you use Python scripts, install:

```bash
pip install psycopg2 python-dotenv
```

### **Environment Variables**

In `backend/.env` set:

```
TIMESCALE_SERVICE_URL=postgres://USER:PASSWORD@HOST:PORT/tsdb?sslmode=require
```

Then export it when running:

```bash
export TIMESCALE_SERVICE_URL="$(cat backend/.env | cut -d '=' -f2-)"
```

Check it:

```bash
echo $TIMESCALE_SERVICE_URL
```

### **Build & Run**

From inside `/backend`:

```bash
cmake -B build -G Ninja
cmake --build build
```

Start the server:

```bash
./build/stocksight-backend
```

You should see:

```
Listening on http://localhost:8080
```

---

## 🔌 Backend API Endpoints

### Health

```
GET /api/health
```

### Price history

```
GET /api/prices?ticker=AAPL
```

### Indicators (MACD, RSI, Bollinger)

```
GET /api/indicators?ticker=AAPL
```

### Quick testing with curl

```bash
curl "http://localhost:8080/api/health"
curl "http://localhost:8080/api/prices?ticker=AAPL"
curl "http://localhost:8080/api/indicators?ticker=AAPL"
```

If you get JSON back, backend works.

---

# 🌐 Frontend (React + Vite)

The frontend calls the backend API and renders charts.

### **Requirements**

* Node.js 18+

Install dependencies:

```bash
cd frontend
npm install
```

### **Frontend Environment Variable**

In `frontend/.env`:

```
VITE_API_URL=http://localhost:8080
```

### **Run the UI**

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

The frontend will automatically fetch:

* `/api/prices`
* `/api/indicators`

---

# ✔️ How to Run Both Together

**Terminal 1 – backend**

```bash
cd backend
export TIMESCALE_SERVICE_URL=...
./build/stocksight-backend
```

**Terminal 2 – frontend**

```bash
cd frontend
npm run dev
```

---

# 🎯 Summary

* Backend is **C++**, uses **TimescaleDB**, and exposes `/api/*` endpoints.
* Frontend is **React**, calls the backend using `VITE_API_URL`.
* You can test the backend using curl before connecting the frontend.
* Everything runs locally on:

  * Backend → [http://localhost:8080](http://localhost:8080)
  * Frontend → [http://localhost:5173](http://localhost:5173)

>>>>>>> develop
