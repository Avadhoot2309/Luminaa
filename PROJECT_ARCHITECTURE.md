# 🧠 Lumina — System Architecture & Technical Documentation

> **An Adaptive, Multimodal Learning Platform Engineered for Neurodivergent Learners (ADHD, Dyslexia, Autism, Visual Impairment).**

---

## 🏛️ High-Level System Architecture

```
+-----------------------------------------------------------------------------+
|                                 CLIENT TIER                                 |
|                       (React 18 + Vite SPA on Vercel)                       |
|                                                                             |
|   +-------------------+   +--------------------+   +--------------------+   |
|   | Dual-Auth Context |   | Accessibility Hub  |   | Behavior Tracker   |   |
|   | (Firebase / PIN)  |   | (Dyslexia / Visual)|   | (Hesitation/Idle)  |   |
|   +-------------------+   +--------------------+   +--------------------+   |
|             |                       |                        |              |
|             +-----------------------+------------------------+              |
|                                     |                                       |
|                                     v                                       |
|                           [GlobalAssistant (Leo)]                           |
|                       (Web Speech API + Lottie Mascot)                      |
+-----------------------------------------------------------------------------+
                                      |
                     REST HTTPS (JSON) + CORS Auth
                                      |
                                      v
+-----------------------------------------------------------------------------+
|                                BACKEND TIER                                 |
|                     (Node.js + Express on Render / GCP)                     |
|                                                                             |
|   +-------------------+   +--------------------+   +--------------------+   |
|   |   CORS & Security |   |   Leo Controller   |   | Prompt Engineering |   |
|   |     Middleware    |   |   (api/leo.js)     |   |   (Scaffolding)    |   |
|   +-------------------+   +--------------------+   +--------------------+   |
|                                     |                                       |
|                                     v                                       |
|                     [Groq LPU Client (groqClient.js)]                       |
|                         Llama-3.3-70B (<500ms latency)                      |
+-----------------------------------------------------------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------+
|                             CLOUD DATA SERVICES                             |
|                        (Google Firebase Cloud Infra)                        |
|                                                                             |
|   +-------------------+   +--------------------+   +--------------------+   |
|   |   Firebase Auth   |   |  Cloud Firestore   |   |   Cloud Storage    |   |
|   | (Educators/Parent)|   | (Telemetry/Records)|   |  (Lesson Media/PDF)|   |
|   +-------------------+   +--------------------+   +--------------------+   |
+-----------------------------------------------------------------------------+
```

---

## 🧩 Core Architectural Pillars

### 1. Dual-Authentication Paradigm
- **Educators & Parents**: Authenticate via standard Firebase Authentication (email & password) to access the Teacher Dashboard, manage curricula, and review student progress reports.
- **Young & Neurodivergent Students**: Log in using a simple 4-digit PIN or by scanning an accessible desk badge (printable QR card). This bypasses password recall barriers, fine-motor keyboard fatigue, and reading anxiety.

### 2. The Leo AI Adaptive Feedback Loop
Unlike generic conversational AI bots, **Leo the Tiger** is an interactive, embodied learning companion:
1. **Telemetry Collection**: As the child interacts with a lesson or game, `behaviorTracker.js` tracks:
   - Hesitation duration (inactivity while viewing a problem > 3,000ms).
   - Distraction / idle latency (> 8,000ms).
   - Clustered mistake frequency (>=2 errors within 10 seconds).
2. **Context Enrichment**: When the child speaks or asks for help, the client packages their query with their neurodivergent profile, current problem index, and visible DOM buttons.
3. **Sub-500ms Inference**: Sent to the backend Express server, which queries **Llama-3.3-70B via Groq LPUs**.
4. **Actionable UI Dispatch**: Leo returns a machine-readable JSON schema that doesn't just speak, but highlights UI buttons, triggers confetti celebrations, or dynamically increases font sizes.

### 3. Neurodivergent Accommodations Matrix

| Condition | Platform Adaptation & Feature | Technical Implementation |
|---|---|---|
| **ADHD** | Bite-sized gamified modules (Memory Match, Sort Click), focus timers, animated praise | Phaser / Canvas confetti, reactive visual stimuli |
| **Dyslexia** | OpenDyslexic font toggle, text line spacing, client-side TTS narration | `@mui/material/styles` theme overrides, Web Speech API |
| **Autism / Anxiety** | Predictable layout, structured hints without direct negative critique | Scaffolded prompt engineering in `leoPrompts.js` |
| **Low Vision** | High-contrast themes, scalable typography, voice screen navigation | `AccessibilityContext.jsx`, ARIA attributes |
| **Hearing Impaired** | Interactive Sign Language learning module, visual captions | MediaPipe hand tracking & sign matching games |

---

## 📁 Repository Directory Structure

```
Luminaa/
├── package.json               # Root workspace runner scripts
├── render.yaml                # Render cloud blueprint (Frontend + Backend)
├── DEPLOYMENT_GUIDE.md        # Step-by-step production deployment manual
├── PROJECT_ARCHITECTURE.md    # Technical architecture & design documentation
│
└── Lumina-main/
    ├── package.json           # Lumina monorepo runner
    │
    ├── backend/               # Node.js + Express API Service
    │   ├── package.json       # Backend dependencies (express, groq-sdk, cors, firebase-admin)
    │   ├── .env.example       # Backend environment variables template
    │   ├── firebase.json      # Firebase Functions & Hosting deployment manifest
    │   ├── functions/
    │   │   └── index.js       # Main Express app, CORS, and Cloud Function export
    │   ├── api/
    │   │   ├── leo.js         # Leo AI controller and intent routes
    │   │   └── utils/
    │   │       ├── groqClient.js  # Groq SDK wrapper with JSON enforcement
    │   │       └── leoPrompts.js  # Neurodivergent contextual prompt engine
    │   ├── config/
    │   │   └── firebase-admin-config.js # Resilient Firebase Admin SDK loader
    │   └── scripts/
    │       └── seed-database.js   # Database population script
    │
    └── frontend/              # Vite + React Single Page Application
        ├── package.json       # Frontend dependencies (react, @mui, lottie, firebase, etc.)
        ├── vercel.json        # Vercel SPA routing rewrite config
        ├── .env.example       # Frontend environment variables template
        ├── public/
        │   └── _redirects     # Netlify & static host SPA routing fallback
        └── src/
            ├── App.jsx        # Route definitions, role guards, provider hierarchy
            ├── config/
            │   └── firebase.js# Client Firebase SDK initialization
            ├── contexts/
            │   ├── AuthContext.jsx       # Dual-auth (Firebase Email + PIN/QR)
            │   ├── AccessibilityContext.jsx # Dyslexia/contrast theme states
            │   └── LearningAssistantContext.jsx # Leo voice & state loop
            ├── components/
            │   └── GlobalAssistant.jsx   # Animated mascot & speech interface
            ├── services/
            │   ├── leoService.js         # Client API client for backend
            │   ├── intentParser.js       # Voice NLU intent classifier
            │   ├── behaviorTracker.js    # Passive interaction telemetry
            │   └── qrService.js          # QR desk badge generator
            └── pages/                    # Dashboards, games, and lesson players
```

---

## 🔒 Security & Best Practices

1. **Zero Secret Exposure**: All production secrets (`GROQ_API_KEY`, service account credentials) are kept exclusively on the server side or injected via environment variables.
2. **Safe Client Keys**: Firebase client configuration uses public keys protected by Firestore security rules.
3. **Robust CORS**: The backend strictly validates origins while maintaining full compatibility with cloud preview deployments.
4. **Graceful Fallbacks**: If the AI backend is unreachable, the client falls back to client-side heuristics and speech synthesis.
