# 🚀 Safio Backend - Quick Reference

## Start Server
```bash
npm install
npm start
```

Server runs on: `http://localhost:3000`

---

## Key Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
```

### User
```
GET    /api/users/:email
PUT    /api/users/:email/profile
```

### Missions
```
GET    /api/missions
POST   /api/missions
POST   /api/missions/:id/join
```

### Incidents
```
POST   /api/incidents/report
GET    /api/incidents
POST   /api/incidents/:id/verify
```

### Risk & News
```
POST   /api/predict-risk
GET    /api/news?lat=X&lng=Y
```

### Health
```
GET    /api/health
```

---

## Test Endpoints

### Check Server is Running
```bash
curl http://localhost:3000/api/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'
```

### Get Risk Score
```bash
curl -X POST http://localhost:3000/api/predict-risk \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 12.9716,
    "lng": 77.5946,
    "timeOfDay": "night"
  }'
```

### Get Local News
```bash
curl http://localhost:3000/api/news?lat=12.9716&lng=77.5946
```

---

## Features

✅ User Authentication (Register & Login)  
✅ User Profile Management  
✅ Mission Management (CRUD + Join)  
✅ Incident Reporting & Verification  
✅ Risk Score Calculation  
✅ Local News Generation  
✅ Health Monitoring  
✅ Error Handling  
✅ Request Logging  

---

## Files Documentation

| File | Purpose |
|------|---------|
| `server.js` | Main backend server |
| `package.json` | Dependencies & scripts |
| `.env` | Configuration |
| `API_DOCUMENTATION.md` | Complete API reference |
| `BACKEND_SETUP.md` | Installation & setup guide |
| `BACKEND_SUMMARY.md` | Feature overview |

---

## Data Stored In-Memory

- **Users**: Registrations & profiles
- **Missions**: All created missions
- **Incidents**: All reported incidents
- **Verifications**: Incident verifications

*Note: Data resets on server restart. Use database for persistence.*

---

## Next Steps

1. **Test the API** with provided endpoints above
2. **Connect Frontend** - Update login page to call `/api/auth/login`
3. **Add Database** - Replace in-memory with PostgreSQL/MongoDB
4. **Implement JWT** - Upgrade authentication for production
5. **Deploy** - Heroku, AWS, DigitalOcean, etc.

---

## Troubleshooting

### Port 3000 in use?
```bash
# Windows: Find & kill process
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### npm install fails?
```bash
# Clear cache & reinstall
npm cache clean --force
npm install
```

### Python errors?
```bash
# Verify Python installed
python --version

# Check script exists
ls ai_predictor.py
```

---

## Configuration (.env)

```
PORT=3000                    # Server port
NODE_ENV=development         # Environment
JWT_SECRET=your_secret       # Auth key
PYTHON_PATH=python          # Python executable
LOG_LEVEL=debug             # Logging level
```

---

## Response Format

### Success ✅
```json
{
  "success": true,
  "message": "Operation completed",
  "data": {...}
}
```

### Error ❌
```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## Database Schema (Future)

### Users
`id, email, password, firstName, lastName, phone, location, trustScore`

### Missions
`id, title, description, location, type, priority, status, volunteersNeeded`

### Incidents
`id, title, description, location, category, severity, status, verifications`

---

For complete documentation, see:
- 📖 `API_DOCUMENTATION.md` - Full API reference
- 🔧 `BACKEND_SETUP.md` - Setup guide
- 📊 `BACKEND_SUMMARY.md` - Feature overview

---

**Last Updated**: November 26, 2025  
**Version**: 1.0.0  
**Status**: Ready to Use ✅
