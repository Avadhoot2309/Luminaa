/**
 * ============================================================================
 * LUMINA BACKEND API SERVER
 * ============================================================================
 * 
 * Project: Lumina — Neurodivergent & Multimodal Adaptive Learning Platform
 * Purpose: Express server powering the "Leo" AI learning companion.
 * 
 * Architecture Note for Mentors & Group Members:
 * ----------------------------------------------------------------------------
 * 1. Hybrid Deployment Target:
 *    - Standalone Mode (Render, Railway, Docker, Local): When executed directly
 *      via `node functions/index.js`, it binds to process.env.PORT (0.0.0.0).
 *    - Serverless Mode (Firebase Cloud Functions): When deployed via `firebase deploy`,
 *      the Express app is exported as `exports.api = functions.https.onRequest(app)`.
 * 
 * 2. Primary Responsibilities:
 *    - Receive real-time student interaction context from the React frontend
 *    - Track behavioral metrics (hesitation, error counts, idle state)
 *    - Construct contextual AI prompts tailored to the student's learning profile
 *    - Communicate with Groq / Llama-3 LLM with low latency (<500ms)
 *    - Return structured JSON instructions (speech, UI highlights, adaptations)
 * ============================================================================
 */

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend .env file (if present locally)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import Leo AI Controllers (modular business logic)
const leoController = require('../api/leo');

// Initialize Express application instance
const app = express();

// ============================================================================
// 1. CORS MIDDLEWARE (Cross-Origin Resource Sharing)
// ============================================================================
// Essential for production: allows the frontend (hosted on Vercel, Firebase,
// or custom domain) to send HTTP requests to this backend without browser blocking.

const configuredFrontendUrls = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(url => url.trim().replace(/\/$/, ''))
    .filter(Boolean);

const defaultAllowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    ...configuredFrontendUrls
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server health checks)
        if (!origin) return callback(null, true);

        // Check if origin matches configured allowed origins
        const isExplicitlyAllowed = defaultAllowedOrigins.includes(origin);

        // Allow Vercel preview domains (*.vercel.app) and Firebase Hosting domains (*.web.app, *.firebaseapp.com)
        const isVercelOrFirebasePreview = 
            /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin) ||
            /^https:\/\/[a-zA-Z0-9_-]+\.web\.app$/.test(origin) ||
            /^https:\/\/[a-zA-Z0-9_-]+\.firebaseapp\.com$/.test(origin);

        if (isExplicitlyAllowed || isVercelOrFirebasePreview) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Incoming origin '${origin}' not explicitly whitelisted. Permitting for development/demo fallback.`);
            // Permitting in fallback mode ensures demo presentations never get blocked
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// ============================================================================
// 2. REQUEST PARSING & LOGGING
// ============================================================================
// Parse incoming JSON payloads and URL-encoded query parameters
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Educational Request Logger: Prints each incoming request timestamp and route
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] [HTTP] ${req.method} ${req.path}`);
    next();
});

// ============================================================================
// 3. SYSTEM & HEALTH CHECK ROUTES
// ============================================================================

/**
 * GET /
 * Root welcoming endpoint and API manifest for evaluators and mentors.
 */
app.get('/', (req, res) => {
    res.json({
        name: 'Lumina Adaptive Learning API',
        status: 'online',
        version: '1.0.0',
        mascot: 'Leo the Tiger (Adaptive AI Companion)',
        endpoints: {
            health: 'GET /health',
            leoAssist: 'POST /api/leo-assist (Main adaptive multimodal helper)',
            leoHint: 'POST /api/leo/hint (Contextual lesson hints)',
            parseIntent: 'POST /api/leo/parse-intent (Voice command intent parser)'
        },
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /health
 * Dedicated health-check route used by deployment platforms (Render, Railway, Uptime monitors)
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'Leo AI Backend Service',
        environment: process.env.NODE_ENV || 'development',
        hasGroqKey: Boolean(process.env.GROQ_API_KEY),
        timestamp: new Date().toISOString()
    });
});

// ============================================================================
// 4. LEO AI ASSISTANT ROUTES
// ============================================================================

/**
 * POST /api/leo-assist
 * Primary endpoint: Processes student input, behavioral state, lesson context,
 * and current DOM interactive elements, generating adaptive multimodal AI feedback.
 */
app.post('/api/leo-assist', leoController.handleLeoAssist);

/**
 * POST /api/leo/hint
 * Contextual hint generator: Gives tiered progressive hints when a child struggles.
 */
app.post('/api/leo/hint', leoController.handleGetHint);

/**
 * POST /api/leo/parse-intent
 * Natural Language Voice Understanding: Extracts navigation & gameplay intents.
 */
app.post('/api/leo/parse-intent', leoController.handleParseIntent);

// ============================================================================
// 5. ERROR HANDLING & FALLBACKS
// ============================================================================

// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
        suggestion: 'Check GET / for available API routes'
    });
});

// Global central error handler middleware
app.use((err, req, res, next) => {
    console.error('[CRITICAL SERVER ERROR]', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error occurred in Leo service',
    });
});

// ============================================================================
// 6. SERVER INITIALIZATION / FIREBASE CLOUD FUNCTION EXPORT
// ============================================================================

// Export for Firebase Cloud Functions deployment (`firebase deploy --only functions`)
exports.api = functions.https.onRequest(app);

// Standalone execution for Node.js containers (Render, Railway, Fly.io, Local)
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`
╔════════════════════════════════════════════════════════════════════╗
║             🐯 LUMINA ADAPTIVE LEARNING BACKEND READY 🐯            ║
╠════════════════════════════════════════════════════════════════════╣
║  • Port:        ${PORT}                                               ║
║  • Host:        0.0.0.0 (Accessible across local network/containers)║
║  • Environment: ${process.env.NODE_ENV || 'development'}                                   ║
║  • AI Engine:   Groq SDK / Llama-3.3-70b-versatile                 ║
║  • Status:      Accepting requests at http://localhost:${PORT}        ║
╚════════════════════════════════════════════════════════════════════╝
        `);
    });
}

