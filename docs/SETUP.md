# Installation and Setup

## 1. Install Node.js

Install Node.js 20 LTS or newer from `https://nodejs.org`.

Check:

```bash
node -v
npm -v
```

## 2. Install Python 3.10+

Install Python from `https://www.python.org/downloads`.

Check:

```bash
python --version
pip --version
```

## 3. Install MySQL + phpMyAdmin

For students, XAMPP is the easiest path:

1. Install XAMPP from `https://www.apachefriends.org`.
2. Start Apache and MySQL.
3. Open phpMyAdmin at `http://localhost/phpmyadmin`.
4. Import `database/schema.sql`.
5. Import `database/seed.sql`.

## 4. Install VS Code + Extensions

Install VS Code and these extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Python
- SQLTools
- REST Client

## 5. Backend Packages

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Important `.env` values:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
USE_MYSQL=false
```

Set `USE_MYSQL=true` after importing the database scripts.

## 6. Frontend Packages

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend connects to the backend through:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000/ws/tracking
```

## 7. ML Packages

```bash
cd ml-model
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python train_expiry_model.py
python predict_expiry.py --food-type rice --storage-condition room_temp --temperature-c 30 --age-hours 4
```

Why the ML stack is used:

- `scikit-learn`: trains a practical expiry regression model from tabular food/storage data.
- `opencv-python`: preprocesses food images for future CNN/pretrained models.
- `tensorflow`: included for extending the image classifier into a CNN.

## 8. Google Maps API Key

1. Go to `https://console.cloud.google.com`.
2. Create a project.
3. Enable Maps JavaScript API and Distance Matrix API.
4. Create an API key under APIs & Services > Credentials.
5. Restrict it by HTTP referrer for frontend and IP/server key for backend.
6. Put the key in:

```env
GOOGLE_MAPS_API_KEY=your_backend_key
VITE_GOOGLE_MAPS_API_KEY=your_frontend_key
```

This repo uses Haversine distance as a fallback so it works without billing setup.

## 9. Connecting Database

In `backend/.env`:

```env
USE_MYSQL=true
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_mess_food
```

Restart the backend after changing `.env`.

