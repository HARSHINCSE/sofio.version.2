# 🚀 PredictShield Setup Guide

## Issue: "Site can't be reached"

This usually means Node.js is not installed or the server isn't running. Follow these steps:

## Step 1: Install Node.js

1. **Download Node.js** from: https://nodejs.org/
   - Choose the **LTS version** (recommended)
   - Download the Windows Installer (.msi)

2. **Install Node.js**:
   - Run the installer
   - Follow the installation wizard
   - Make sure to check "Add to PATH" option
   - Restart your terminal/PowerShell after installation

3. **Verify Installation**:
   Open a new PowerShell/Command Prompt and run:
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v18.17.0 and 9.6.7)

## Step 2: Install Python

1. **Download Python** from: https://www.python.org/downloads/
   - Choose Python 3.11 or newer
   - During installation, check **"Add Python to PATH"**

2. **Verify Installation**:
   ```powershell
   python --version
   ```
   You should see something like: Python 3.11.x

## Step 3: Install Dependencies

1. **Navigate to project folder**:
   ```powershell
   cd "C:\Users\harsh\OneDrive\Desktop\New folder (3)\safecity-predictshield"
   ```

2. **Install npm packages**:
   ```powershell
   npm install express python-shell
   ```

## Step 4: Start the Server

Run one of these commands:

**Option 1 - Using npm:**
```powershell
npm start
```

**Option 2 - Direct node command:**
```powershell
node server.js
```

You should see:
```
🚀 PredictShield server running on http://localhost:3000
📍 Ready to predict safety risks!
```

## Step 5: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

## Troubleshooting

### Port 3000 already in use?
Change the port in `server.js`:
```javascript
const PORT = 3001; // or any other available port
```

### Python not found?
If you get "Python not found" errors:
- Make sure Python is added to PATH
- Try changing `pythonPath: 'python'` to `pythonPath: 'python3'` in server.js
- Or use full path: `pythonPath: 'C:\\Python311\\python.exe'`

### Still having issues?
1. Make sure all files are in the correct folders
2. Check that `node_modules` folder exists after `npm install`
3. Verify Python script `ai_predictor.py` is in the same folder as `server.js`
4. Check the console for error messages

## Quick Start Script

After installing Node.js and Python, you can use the `start.bat` file (double-click it) to start the server automatically.

