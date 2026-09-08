/**
 * BACKEND API SETUP
 * Express server with Leo endpoints
 */

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import Leo handlers
const leoController = require('../api/leo');

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// 1. CORS (Must be at the very top for preflight to work)
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('[CORS] Origin not allowed:', origin);
            callback(null, true); // Fallback to true in dev, but log it
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 2. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ==================== LEO ROUTES ====================

/**
 * POST /api/leo-assist
 * Main Leo endpoint for adaptive responses
 */
app.post('/api/leo-assist', leoController.handleLeoAssist);

/**
 * POST /api/leo/hint
 * Get a hint for activity
 */
app.post('/api/leo/hint', leoController.handleGetHint);

/**
 * POST /api/leo/parse-intent
 * Parse user intent from voice command
 */
app.post('/api/leo/parse-intent', leoController.handleParseIntent);

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Leo Backend', timestamp: new Date().toISOString() });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
        path: req.path,
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
    });
});

// ==================== SERVER START ====================

// For Firebase deployment and emulators
exports.api = functions.https.onRequest(app);

// Start the Express server directly only if run with node directly and not by emulator
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`
╔═══════════════════════════════════════╗
║     🐯 LEO BACKEND SERVICE READY 🐯    ║
║                                       ║
║  Port: ${PORT}                            ║
║  Environment: ${process.env.NODE_ENV || 'development'}                ║
║  Claude Model: Groq (claude-compatible)║
║  Ready for requests!                  ║
╚═══════════════════════════════════════╝
        `);
    });
}
