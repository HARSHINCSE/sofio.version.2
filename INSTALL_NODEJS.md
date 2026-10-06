# 🔧 How to Install Node.js (Required for PredictShield)

## Why Node.js is Needed
PredictShield requires Node.js to run the web server. Without it, the site cannot be reached.

## Installation Steps

### Method 1: Official Installer (Recommended)

1. **Go to Node.js website:**
   - Visit: https://nodejs.org/
   - Click the big green "LTS" button (Long Term Support version)
   - This will download the Windows installer

2. **Run the installer:**
   - Double-click the downloaded `.msi` file
   - Click "Next" through the setup wizard
   - **IMPORTANT:** Make sure "Add to PATH" is checked ✅
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Restart your computer** (or at least close and reopen PowerShell/Command Prompt)

4. **Verify installation:**
   Open a NEW PowerShell window and type:
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers like:
   ```
   v18.17.0
   9.6.7
   ```

### Method 2: Using Chocolatey (If you have it)

```powershell
choco install nodejs
```

### Method 3: Using Winget (Windows 10/11)

```powershell
winget install OpenJS.NodeJS.LTS
```

## After Installing Node.js

1. **Open a NEW PowerShell window** (important - old windows won't see Node.js)

2. **Navigate to project:**
   ```powershell
   cd "C:\Users\harsh\OneDrive\Desktop\New folder (3)\safecity-predictshield"
   ```

3. **Install dependencies:**
   ```powershell
   npm install express python-shell
   ```

4. **Start the server:**
   ```powershell
   node server.js
   ```

5. **Open browser:**
   Go to: http://localhost:3000

## Troubleshooting

### "node is not recognized"
- You didn't restart your terminal/PowerShell after installation
- Node.js wasn't added to PATH during installation
- **Solution:** Reinstall Node.js and make sure "Add to PATH" is checked

### "Port 3000 already in use"
- Another program is using port 3000
- **Solution:** Change PORT in `server.js` to 3001 or 8080

### Still not working?
1. Restart your computer
2. Open a fresh PowerShell window
3. Try: `where.exe node` (should show a path)
4. If no path, reinstall Node.js

## Quick Test

After installing, test with:
```powershell
node -e "console.log('Node.js is working!')"
```

If you see "Node.js is working!" then you're good to go!


