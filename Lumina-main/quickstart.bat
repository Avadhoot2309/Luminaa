@echo off
REM ============================================================================
REM LEO QUICK START SCRIPT (Windows)
REM Sets up and runs Leo (Adaptive Learning Assistant)
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  🐯 LEO QUICK START SETUP 🐯                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM ============================================================================
REM 1. CHECK PREREQUISITES
REM ============================================================================

echo [1/5] Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found. Please install npm
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo [OK] Node.js %NODE_VERSION%
echo [OK] npm %NPM_VERSION%
echo.

REM ============================================================================
REM 2. SETUP BACKEND
REM ============================================================================

echo [2/5] Setting up backend...

cd backend

if not exist ".env" (
    echo Creating .env from template...
    copy .env.example .env
    echo [WARNING] IMPORTANT: Edit backend\.env and add your ANTHROPIC_API_KEY
    echo [WARNING] Get it from: https://console.anthropic.com
)

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

echo [OK] Backend ready
cd ..
echo.

REM ============================================================================
REM 3. SETUP FRONTEND
REM ============================================================================

echo [3/5] Setting up frontend...

cd frontend

if not exist ".env" (
    echo Creating .env from template...
    copy .env.example .env
)

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo [OK] Frontend ready
cd ..
echo.

REM ============================================================================
REM 4. DISPLAY INSTRUCTIONS
REM ============================================================================

echo [4/5] Setup complete!
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    🚀 NEXT STEPS 🚀                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [STEP 1] ADD YOUR CLAUDE API KEY:
echo    - Edit: backend\.env
echo    - Add: ANTHROPIC_API_KEY=sk-ant-your-key-here
echo    - Get key from: https://console.anthropic.com
echo.

echo [STEP 2] START BACKEND (in one terminal):
echo    - cd backend
echo    - npm run serve
echo.

echo [STEP 3] START FRONTEND (in another terminal):
echo    - cd frontend
echo    - npm run dev
echo.

echo [STEP 4] OPEN IN BROWSER:
echo    - http://localhost:5173
echo.

echo [STEP 5] TEST LEO:
echo    - Click the 🧪 Test button
echo    - Or click 🎤 Talk and say something
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║            📚 Full Setup Guide: LEO_SETUP_GUIDE.md             ║
echo ║               For detailed instructions & troubleshooting       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [OK] Ready to run Leo! 🐯
echo.

pause
