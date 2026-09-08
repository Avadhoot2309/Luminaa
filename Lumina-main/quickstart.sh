#!/bin/bash

###############################################################################
# LEO QUICK START SCRIPT
# Sets up and runs Leo (Adaptive Learning Assistant)
###############################################################################

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  🐯 LEO QUICK START SETUP 🐯                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# 1. CHECK PREREQUISITES
# ============================================================================

echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
echo -e "${GREEN}✓ npm $(npm --version)${NC}"
echo ""

# ============================================================================
# 2. SETUP BACKEND
# ============================================================================

echo -e "${YELLOW}[2/5] Setting up backend...${NC}"

cd backend

# Check for .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit backend/.env and add your ANTHROPIC_API_KEY${NC}"
    echo -e "${YELLOW}   Get it from: https://console.anthropic.com${NC}"
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Backend ready${NC}"
cd ..
echo ""

# ============================================================================
# 3. SETUP FRONTEND
# ============================================================================

echo -e "${YELLOW}[3/5] Setting up frontend...${NC}"

cd frontend

# Check for .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env from template...${NC}"
    cp .env.example .env
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Frontend ready${NC}"
cd ..
echo ""

# ============================================================================
# 4. DISPLAY INSTRUCTIONS
# ============================================================================

echo -e "${YELLOW}[4/5] Setup complete!${NC}"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    🚀 NEXT STEPS 🚀                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${YELLOW}1. ADD YOUR CLAUDE API KEY:${NC}"
echo "   • Edit: backend/.env"
echo "   • Add: ANTHROPIC_API_KEY=sk-ant-your-key-here"
echo "   • Get key from: https://console.anthropic.com"
echo ""

echo -e "${YELLOW}2. START BACKEND (in one terminal):${NC}"
echo "   $ cd backend"
echo "   $ npm run serve"
echo ""

echo -e "${YELLOW}3. START FRONTEND (in another terminal):${NC}"
echo "   $ cd frontend"
echo "   $ npm run dev"
echo ""

echo -e "${YELLOW}4. OPEN IN BROWSER:${NC}"
echo "   $ http://localhost:5173"
echo ""

echo -e "${YELLOW}5. TEST LEO:${NC}"
echo "   • Click the 🧪 Test button"
echo "   • Or click 🎤 Talk and say something"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║            📚 Full Setup Guide: LEO_SETUP_GUIDE.md             ║"
echo "║               For detailed instructions & troubleshooting       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${GREEN}Ready to run Leo! 🐯${NC}"
