# 🚀 Lumina Deployment Guide

This guide provides step-by-step instructions for deploying the **Lumina** multimodal and neurodivergent adaptive learning platform.

---

## 🏗️ Architecture Overview

Lumina consists of two primary services:
1. **Frontend (`Lumina-main/frontend`)**: React 18 + Vite + TailwindCSS + Material-UI Single Page Application.
2. **Backend (`Lumina-main/backend`)**: Node.js Express server + Groq SDK (Llama-3.3-70B) powering the "Leo" adaptive AI learning assistant.
3. **Database & Storage**: Google Firebase (Authentication, Cloud Firestore, Cloud Storage).

---

## 🌐 Deployment Paths

### Option A: Modern Cloud PaaS (Recommended — Fast & Free Tier Friendly)
- **Frontend**: Deploy on [Vercel](https://vercel.com) (or [Netlify](https://netlify.com))
- **Backend**: Deploy on [Render](https://render.com) (or [Railway](https://railway.app))

### Option B: Unified Firebase Deployment
- **Frontend**: Deploy to Firebase Hosting (`firebase deploy --only hosting`)
- **Backend**: Deploy to Firebase Cloud Functions (`firebase deploy --only functions`)

---

## 🛠️ Step-by-Step Deployment (Option A — Vercel + Render)

### Step 1: Deploy the Backend on Render
1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following settings:
   - **Name**: `lumina-backend`
   - **Root Directory**: `Lumina-main/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   | Variable | Description | Example |
   |---|---|---|
   | `PORT` | Service port | `5001` |
   | `NODE_ENV` | Environment mode | `production` |
   | `GROQ_API_KEY` | Groq API Key (from https://console.groq.com) | `gsk_...` |
   | `FRONTEND_URL` | Allowed frontend origin for CORS | `https://your-frontend.vercel.app` |
   | `FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket | `luminaa-1ffe1.firebasestorage.app` |
   | `FIREBASE_SERVICE_ACCOUNT_KEY` | (Optional) Service account JSON string | `{"type":"service_account",...}` |
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://lumina-backend.onrender.com`).
8. Verify health check by visiting: `https://lumina-backend.onrender.com/health`.

---

### Step 2: Deploy the Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. In the project setup configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `Lumina-main/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   | Variable | Value / Source |
   |---|---|
   | `VITE_API_URL` | Your deployed backend URL (e.g. `https://lumina-backend.onrender.com`) |
   | `VITE_FIREBASE_API_KEY` | Firebase API Key from Firebase Console |
   | `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `luminaa-1ffe1.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | e.g. `luminaa-1ffe1` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | e.g. `luminaa-1ffe1.firebasestorage.app` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | e.g. `1029060325709` |
   | `VITE_FIREBASE_APP_ID` | e.g. `1:1029060325709:web:1fefd17c6b1d1d95a68704` |
   | `VITE_GROQ_API_KEY` | (Optional client fallback) Your Groq API key |
   | `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | Your Cloudinary upload preset |
   | `VITE_USE_CLIENT_SIDE_TTS` | `true` |
   | `VITE_USE_CLIENT_SIDE_OCR` | `true` |
   | `VITE_ENV` | `production` |
5. Click **Deploy**.
6. Copy your generated Vercel domain (e.g., `https://lumina-app.vercel.app`).
7. **Important**: Go back to Render → `lumina-backend` → Environment Variables and update `FRONTEND_URL` with your exact Vercel domain to ensure CORS permits requests.

---

## ⚡ Option B: Full-Stack Deployment via Firebase

If you prefer deploying everything under Google Firebase:

1. Install Firebase CLI globally if not already installed:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in and initialize:
   ```bash
   firebase login
   ```
3. Build the frontend for production:
   ```bash
   npm --prefix Lumina-main/frontend run build
   ```
4. Deploy Hosting and Functions:
   ```bash
   cd Lumina-main/backend
   firebase deploy
   ```
   *(Ensure Google Cloud Functions runtime billing is enabled in your Google Cloud account).*

---

## 🧪 Post-Deployment Checklist

- [ ] Open the frontend URL in your browser.
- [ ] Test student PIN login (e.g., using test student PIN `1234`).
- [ ] Verify that clicking the microphone or mascot invokes "Leo" and produces audio response.
- [ ] Test an ADHD interactive game (e.g. Memory Match, Sort Click).
- [ ] Check browser console (`F12`) to verify zero CORS errors.
- [ ] Visit `<BACKEND_URL>/health` to ensure `status: "ok"`.

---

## 👥 Local Development for Group Members

To run the entire stack locally:
```bash
# 1. Install all dependencies
npm run install:all

# 2. Start the backend service (Terminal 1)
npm run backend

# 3. Start the frontend service (Terminal 2)
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`
