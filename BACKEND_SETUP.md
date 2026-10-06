# Safio Backend Setup Guide

## Overview
Safio is an AI-powered predictive safety dashboard with a comprehensive Node.js/Express backend.

---

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Python** (v3.8 or higher) - for AI predictions
- **Git** (optional)

---

## Installation

### 1. Install Dependencies

```bash
# Navigate to project directory
cd safecity-predictshield

# Install Node packages
npm install
```

This will install:
- `express` - Web framework
- `python-shell` - Python integration
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `body-parser` - Request parsing

### 2. Configure Environment

Create or update `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
PYTHON_PATH=python
```

---

## Running the Server

### Development Mode
```bash
npm start
```

### With Auto-reload (requires nodemon)
```bash
npm run dev
```

You should see:
```
🚀 NxtGenGuard server running on http://localhost:3000
📍 Ready to predict safety risks!
📰 News dashboard enabled!
```

---

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account

### User Management
- `GET /api/users/:email` - Get user profile
- `PUT /api/users/:email/profile` - Update profile

### Missions
- `GET /api/missions` - Get all missions
- `POST /api/missions` - Create new mission
- `POST /api/missions/:id/join` - Join a mission

### Incidents
- `POST /api/incidents/report` - Report incident
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents/:id/verify` - Verify incident

### Risk Prediction
- `POST /api/predict-risk` - Get risk score for location
- `GET /api/news?lat=X&lng=Y` - Get local news

### Health
- `GET /api/health` - Server health status

---

## Testing the Backend

### Using cURL

**Test Health Endpoint:**
```bash
curl http://localhost:3000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Risk Prediction:**
```bash
curl -X POST http://localhost:3000/api/predict-risk \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 12.9716,
    "lng": 77.5946,
    "timeOfDay": "night"
  }'
```

---

## Using Postman

1. Import the collection from `postman_collection.json` (if available)
2. Set base URL to `http://localhost:3000`
3. Test each endpoint

---

## Frontend Integration

### Login Example
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Redirect to dashboard
    window.location.href = '/index.html';
  }
});
```

### Get Risk Prediction
```javascript
fetch('/api/predict-risk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lat: userLat,
    lng: userLng,
    timeOfDay: 'evening'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Risk Score:', data.riskScore);
  console.log('Risk Level:', data.riskLevel);
});
```

---

## Database Setup (Future)

For production, replace in-memory storage with a database:

### PostgreSQL (Recommended)
```bash
# Install PostgreSQL
# Create database
createdb safio_db

# Update .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=safio_db
DB_USER=safio_user
DB_PASSWORD=secure_password
```

### MongoDB (Alternative)
```bash
# Install MongoDB
# Update connection in server.js
MONGODB_URI=mongodb://localhost:27017/safio
```

---

## Python ML Integration

The backend integrates with `ai_predictor.py` for advanced risk calculations:

```bash
# Ensure Python dependencies are installed
pip install numpy pandas scikit-learn

# Python script receives: latitude, longitude
# Returns: risk score, risk factors, recommendations
```

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Python Script Error
```bash
# Check Python version
python --version

# Verify script exists
ls ai_predictor.py

# Run script directly
python ai_predictor.py 12.9716 77.5946
```

---

## Security Considerations

### Before Production:

1. **Authentication**
   - Implement JWT tokens instead of simple tokens
   - Add password hashing (bcrypt)
   - Add rate limiting

2. **Database**
   - Replace in-memory storage with real database
   - Add encryption for sensitive data
   - Enable SSL connections

3. **API Security**
   - Add CORS restrictions
   - Implement request validation
   - Add API versioning

4. **Environment**
   - Never commit `.env` file
   - Use strong secrets
   - Enable HTTPS

---

## Deployment

### Heroku
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git push heroku main
```

### Docker
```bash
# Build image
docker build -t safio .

# Run container
docker run -p 3000:3000 safio
```

### AWS / DigitalOcean
- Set up Node.js environment
- Configure database (RDS/Managed DB)
- Set up CI/CD pipeline
- Configure SSL certificate

---

## Support & Documentation

- Full API docs: See `API_DOCUMENTATION.md`
- Server logs: Check console output
- Error codes: See API error responses

---

## License

MIT License - See LICENSE file for details
