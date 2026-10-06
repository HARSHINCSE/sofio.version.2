# 🛡️ PredictShield - AI-Powered Predictive Safety Mapping

A cutting-edge, production-ready prototype of an AI-powered predictive safety mapping system for SafeCity mobile/web app. Features real-time interactive heatmaps, dynamic risk scoring, and stunning visual effects.

## ✨ Features

- **Real-time Interactive Heatmap**: Visual risk zones with color-coded intensity (green = safe, yellow = caution, red/orange = dangerous)
- **Dynamic Risk Score**: Live risk calculation (0-100) that updates as you move
- **Glowing Visual Effects**: Eye-catching glow effects for high-risk areas
- **Modern UI**: Beautiful dark translucent info panel with animated risk bar
- **Click-to-Recalculate**: Tap/click anywhere on the map to recalculate risk for that location
- **Auto-Updates**: Refreshes risk data every 5 seconds automatically
- **Mobile-Responsive**: Fully optimized for mobile and desktop devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Python 3.6 or higher
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
```bash
cd safecity-predictshield
```

2. Install dependencies:
```bash
npm install express python-shell
```

3. Start the server:
```bash
node server.js
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
safecity-predictshield/
├── server.js              # Node.js Express server
├── ai_predictor.py        # Python AI prediction script
├── package.json           # Node.js dependencies
├── README.md              # This file
└── public/
    ├── index.html         # Main HTML file
    ├── style.css          # Styling and animations
    └── script.js           # Frontend JavaScript logic
```

## 🧠 How It Works

### Backend Architecture

- **Node.js Server** (`server.js`): Express server that handles API requests and serves static files
- **Python AI Predictor** (`ai_predictor.py`): AI brain that calculates risk scores based on:
  - Time of day (higher risk at night: 10 PM - 5 AM)
  - Random safety events that spike risk in certain areas
  - Proximity to events
  - Location-based factors

### Frontend Features

- **Leaflet.js**: Interactive map rendering
- **Leaflet.heat**: Heatmap visualization plugin
- **Real-time Updates**: Automatic refresh every 5 seconds
- **Interactive Controls**: Click anywhere to recalculate risk

### Risk Calculation

The AI predictor uses multiple factors:
- **Time-based Risk**: 50% higher risk between 10 PM - 5 AM
- **Event Simulation**: Random events (30% chance) that create risk spikes
- **Proximity Effects**: Risk increases near simulated events
- **Dynamic Zones**: Generates 40-60 risk zones around user location

## 🎨 Visual Features

- **Gradient Risk Bar**: Smooth animated progress bar with color transitions
- **Status Indicators**: Pulsing indicators (green/yellow/red) based on risk level
- **Glowing Effects**: CSS filters and drop-shadows for high-risk zones
- **Dark Theme**: Modern dark UI with translucent panels
- **Smooth Animations**: CSS transitions and keyframe animations
- **Mobile Optimized**: Responsive design for all screen sizes

## 🔧 Configuration

### Server Port

Default port is `3000`. To change it, edit `server.js`:

```javascript
const PORT = 3000; // Change to your preferred port
```

### Python Path

If Python 3 is not available as `python`, update `server.js`:

```javascript
pythonPath: 'python3', // Use 'python3' on Linux/Mac
```

## 📱 Usage

1. **Allow Location Access**: The app will request your location permission
2. **View Risk Map**: See the heatmap with color-coded risk zones
3. **Monitor Risk Score**: Watch the real-time risk score in the info panel
4. **Click to Explore**: Click anywhere on the map to see risk for that location
5. **Auto-Updates**: The map refreshes every 5 seconds automatically

## 🎯 Risk Levels

- **0-39**: 🟢 SAFE (Green)
- **40-69**: 🟡 CAUTION (Yellow)
- **70-100**: 🔴 HIGH RISK (Red) - Shows warning emoji and glowing effects

## 🛠️ Troubleshooting

### Python Not Found
- Ensure Python 3 is installed and in your PATH
- On Windows, you may need to use `python` instead of `python3`
- On Linux/Mac, try `python3` if `python` doesn't work

### Port Already in Use
- Change the PORT in `server.js` to an available port
- Or stop the process using port 3000

### Geolocation Not Working
- Ensure you're using HTTPS or localhost
- Check browser permissions for location access
- The app will fallback to a default location if geolocation fails

## 📝 License

MIT License - Feel free to use and modify as needed.

## 🎉 Enjoy!

PredictShield is ready to help keep communities safe with AI-powered predictive mapping. Stay safe! 🛡️

