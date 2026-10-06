@echo off
chcp 65001 >nul
echo ========================================
echo   PredictShield - Starting Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is NOT installed or not in PATH!
    echo.
    echo ════════════════════════════════════════════════════
    echo   INSTALLATION REQUIRED
    echo ════════════════════════════════════════════════════
    echo.
    echo 1. Go to: https://nodejs.org/
    echo 2. Download the LTS version (big green button)
    echo 3. Run the installer
    echo 4. CHECK "Add to PATH" during installation ✅
    echo 5. RESTART your computer after installation
    echo 6. Then run this script again
    echo.
    echo See INSTALL_NODEJS.md for detailed instructions
    echo.
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Python is not found in PATH!
    echo The server may not work correctly.
    echo Please install Python from: https://www.python.org/downloads/
    echo.
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install express python-shell
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
)

echo Starting PredictShield server...
echo.
echo Open your browser and go to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js

pause

