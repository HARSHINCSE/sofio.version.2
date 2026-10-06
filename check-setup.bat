@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════
echo   PredictShield - System Check
echo ═══════════════════════════════════════════════════════
echo.

set MISSING=0

echo [1/4] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo    ✓ Node.js found: %NODE_VERSION%
) else (
    echo    ✗ Node.js NOT FOUND
    echo      → Install from: https://nodejs.org/
    set /a MISSING+=1
)
echo.

echo [2/4] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo    ✓ npm found: %NPM_VERSION%
) else (
    echo    ✗ npm NOT FOUND
    set /a MISSING+=1
)
echo.

echo [3/4] Checking Python...
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo    ✓ Python found: %PYTHON_VERSION%
) else (
    echo    ✗ Python NOT FOUND
    echo      → Install from: https://www.python.org/downloads/
    set /a MISSING+=1
)
echo.

echo [4/4] Checking dependencies...
if exist "node_modules\express" (
    echo    ✓ Dependencies installed
) else (
    echo    ✗ Dependencies NOT installed
    echo      → Run: npm install express python-shell
    set /a MISSING+=1
)
echo.

echo ═══════════════════════════════════════════════════════
if %MISSING% EQU 0 (
    echo   ✓ All checks passed! You can start the server.
    echo   → Run: node server.js
    echo   → Or double-click: start.bat
) else (
    echo   ✗ %MISSING% issue(s) found. Please fix them first.
    echo.
    echo   See INSTALL_NODEJS.md for installation help.
)
echo ═══════════════════════════════════════════════════════
echo.
pause


