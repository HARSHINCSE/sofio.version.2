@echo off
echo Testing Python script...
echo.

python ai_predictor.py 37.7749 -122.4194

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Python script is working!
) else (
    echo.
    echo [ERROR] Python script failed. Make sure Python is installed.
)

pause


