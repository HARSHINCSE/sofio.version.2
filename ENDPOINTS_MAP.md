# 🗺️ Safio API Endpoints Map

## Overview - All 20+ Endpoints

```
BASE URL: http://localhost:3000

┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION (2 Endpoints)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST   /api/auth/register          Register new account       │
│         ├─ Input: email, password, firstName, lastName         │
│         └─ Output: userId, user object                         │
│                                                                 │
│  POST   /api/auth/login             Login to account           │
│         ├─ Input: email, password                              │
│         └─ Output: token, user object                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  USER MANAGEMENT (2 Endpoints)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GET    /api/users/:email           Get user profile           │
│         ├─ Input: email (URL param)                            │
│         └─ Output: user profile, stats                         │
│                                                                 │
│  PUT    /api/users/:email/profile   Update user profile        │
│         ├─ Input: firstName, lastName, phone, location, bio    │
│         └─ Output: updated user object                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  MISSIONS (3 Endpoints)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GET    /api/missions               Get all missions           │
│         ├─ Input: none                                         │
│         └─ Output: array of missions                           │
│                                                                 │
│  POST   /api/missions               Create new mission         │
│         ├─ Input: title, description, location, type,         │
│         │         priority, volunteers, endDate               │
│         └─ Output: mission object with ID                     │
│                                                                 │
│  POST   /api/missions/:id/join      Join a mission            │
│         ├─ Input: mission ID (URL param)                      │
│         └─ Output: updated mission, volunteer count           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  INCIDENTS (3 Endpoints)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST   /api/incidents/report       Report incident            │
│         ├─ Input: title, description, location, category,     │
│         │         severity                                     │
│         └─ Output: incident object with ID                    │
│                                                                 │
│  GET    /api/incidents              Get all incidents          │
│         ├─ Input: none                                         │
│         └─ Output: array of incidents                          │
│                                                                 │
│  POST   /api/incidents/:id/verify   Verify incident           │
│         ├─ Input: incident ID (URL param)                     │
│         └─ Output: updated incident, verification count       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              RISK PREDICTION & NEWS (2 Endpoints)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST   /api/predict-risk           Get risk score             │
│         ├─ Input: lat, lng, timeOfDay                          │
│         └─ Output: riskScore, riskLevel, factors,             │
│                   recommendation                               │
│                                                                 │
│  GET    /api/news?lat=X&lng=Y       Get local news            │
│         ├─ Input: latitude, longitude (query params)          │
│         └─ Output: array of news items                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    HEALTH CHECK (1 Endpoint)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GET    /api/health                 Server health check        │
│         ├─ Input: none                                         │
│         └─ Output: status, uptime, database counts            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Endpoint Categories

### 🔐 Authentication Flow
```
1. User visits login page (login.html)
   ↓
2. User submits credentials
   ↓
3. Frontend calls: POST /api/auth/login
   ↓
4. Server validates & returns token + user
   ↓
5. Frontend stores token & redirects to dashboard
   ↓
6. User now logged in ✅
```

### 👤 User Profile Flow
```
1. User clicks profile icon
   ↓
2. Frontend calls: GET /api/users/:email
   ↓
3. Server returns user profile & stats
   ↓
4. Profile page displays user data
   ↓
5. User edits profile fields
   ↓
6. Frontend calls: PUT /api/users/:email/profile
   ↓
7. Server updates profile
   ↓
8. Confirmation shown ✅
```

### 🎯 Mission Flow
```
1. Dashboard shows missions: GET /api/missions
   ↓
2. User clicks "Join Mission"
   ↓
3. Frontend calls: POST /api/missions/:id/join
   ↓
4. Server increments volunteer count
   ↓
5. Mission updated ✅
   ↓
6. User can create mission: POST /api/missions
   ↓
7. New mission appears in list ✅
```

### 🚨 Incident Flow
```
1. User reports incident: POST /api/incidents/report
   ↓
2. Incident created with ID
   ↓
3. Other users verify: POST /api/incidents/:id/verify
   ↓
4. Verification count increases
   ↓
5. Incidents visible in list: GET /api/incidents ✅
```

### 📊 Risk & News Flow
```
1. Dashboard gets user location
   ↓
2. Frontend calls: POST /api/predict-risk
   ↓
3. Server calculates risk score
   ↓
4. Risk displayed on map ✅
   ↓
5. Frontend also calls: GET /api/news?lat=X&lng=Y
   ↓
6. Local news displayed in panel ✅
```

---

## 🔄 Method Overview

### GET Requests (Read Only)
```
GET /api/missions           → List all missions
GET /api/incidents          → List all incidents
GET /api/users/:email       → Get user profile
GET /api/news?lat=X&lng=Y   → Get local news
GET /api/health             → Check server status
```

### POST Requests (Create/Update)
```
POST /api/auth/register           → Create account
POST /api/auth/login              → Authenticate user
POST /api/missions                → Create mission
POST /api/missions/:id/join       → Join mission
POST /api/incidents/report        → Report incident
POST /api/incidents/:id/verify    → Verify incident
POST /api/predict-risk            → Get risk prediction
```

### PUT Requests (Update)
```
PUT /api/users/:email/profile     → Update profile
```

---

## 📋 Request/Response Examples

### Example 1: Register User
```
REQUEST:
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123",
  "firstName": "John",
  "lastName": "Doe"
}

RESPONSE (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "userId": "a1b2c3d4",
  "user": {
    "id": "a1b2c3d4",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Example 2: Login
```
REQUEST:
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}

RESPONSE (200 OK):
{
  "success": true,
  "message": "Login successful",
  "token": "a1b2c3d4e5f6g7h8",
  "user": {
    "id": "a1b2c3d4",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "stats": {
      "missionsCompleted": 5,
      "communityVerified": 12,
      "trustScore": 4.5
    }
  }
}
```

### Example 3: Get Risk Prediction
```
REQUEST:
POST /api/predict-risk
Content-Type: application/json

{
  "lat": 12.9716,
  "lng": 77.5946,
  "timeOfDay": "night"
}

RESPONSE (200 OK):
{
  "success": true,
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "riskScore": "67.45",
  "riskLevel": "High",
  "factors": [
    {"factor": "Historical incidents", "weight": 40, "impact": "High"},
    {"factor": "Time of day", "weight": 25, "impact": "High"},
    {"factor": "Crowd density", "weight": 20, "impact": "Medium"},
    {"factor": "Lighting", "weight": 15, "impact": "Low"}
  ],
  "recommendation": "Avoid non-essential travel"
}
```

### Example 4: Create Mission
```
REQUEST:
POST /api/missions
Content-Type: application/json

{
  "title": "Safety Patrol - Downtown",
  "description": "Community safety patrol",
  "location": {"lat": 12.9716, "lng": 77.5946},
  "type": "patrol",
  "priority": "high",
  "volunteers": 5
}

RESPONSE (201 Created):
{
  "success": true,
  "message": "Mission created successfully",
  "mission": {
    "id": "m1a2b3c4",
    "title": "Safety Patrol - Downtown",
    "status": "active",
    "volunteersNeeded": 5,
    "volunteersJoined": 0,
    "createdAt": "2025-11-26T10:30:00Z"
  }
}
```

### Example 5: Report Incident
```
REQUEST:
POST /api/incidents/report
Content-Type: application/json

{
  "title": "Suspicious Activity",
  "description": "Unknown group near park",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946,
    "address": "Park Street"
  },
  "category": "suspicious_activity",
  "severity": "medium"
}

RESPONSE (201 Created):
{
  "success": true,
  "message": "Incident reported successfully",
  "incident": {
    "id": "i1a2b3c4",
    "title": "Suspicious Activity",
    "status": "reported",
    "verifications": 0,
    "createdAt": "2025-11-26T10:45:00Z"
  }
}
```

---

## ✅ HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| **200** | OK | Successful GET/POST |
| **201** | Created | Resource created |
| **400** | Bad Request | Invalid input |
| **401** | Unauthorized | Missing/invalid auth |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Duplicate/conflict |
| **500** | Server Error | Unexpected error |

---

## 🧪 Testing All Endpoints

### Quick Test Script
```bash
#!/bin/bash

# Health check
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get Missions
curl http://localhost:3000/api/missions

# Get Risk
curl -X POST http://localhost:3000/api/predict-risk \
  -H "Content-Type: application/json" \
  -d '{"lat":12.9716,"lng":77.5946,"timeOfDay":"night"}'

# Get News
curl http://localhost:3000/api/news?lat=12.9716&lng=77.5946
```

---

## 🔗 Integration Points

### Frontend → Backend
```javascript
// Login Integration
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({email, password})
}).then(r => r.json()).then(data => {
  localStorage.setItem('token', data.token);
  window.location.href = '/index.html';
});

// Risk Prediction
fetch('/api/predict-risk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({lat, lng, timeOfDay})
}).then(r => r.json()).then(data => {
  console.log(`Risk: ${data.riskLevel}`);
});

// Get Missions
fetch('/api/missions')
  .then(r => r.json())
  .then(data => {
    data.missions.forEach(m => console.log(m.title));
  });
```

---

## 📱 API Response Format

All responses follow consistent format:

### Success
```json
{
  "success": true,
  "message": "Description",
  "data": {...},
  "timestamp": "2025-11-26T10:50:00Z"
}
```

### Error
```json
{
  "error": "Error message",
  "status": 400,
  "details": "Additional info",
  "timestamp": "2025-11-26T10:50:00Z"
}
```

---

## 🎯 Endpoint Statistics

| Category | Endpoints | Methods |
|----------|-----------|---------|
| Authentication | 2 | POST |
| User Management | 2 | GET, PUT |
| Missions | 3 | GET, POST |
| Incidents | 3 | POST, GET |
| Risk/News | 2 | POST, GET |
| Health | 1 | GET |
| **TOTAL** | **13** | **GET/POST/PUT** |

---

## 🔀 Data Flow Diagram

```
┌─────────────┐
│  User       │
│  Browser    │
└──────┬──────┘
       │
       │ HTTP Request
       ↓
┌─────────────────────────┐
│  Express.js Server      │
│  (http://localhost:3000)│
├─────────────────────────┤
│                         │
│  Routes:                │
│  • /api/auth/*          │
│  • /api/users/*         │
│  • /api/missions/*      │
│  • /api/incidents/*     │
│  • /api/predict-risk    │
│  • /api/news            │
│  • /api/health          │
│                         │
└────────┬────────────────┘
         │
         │ Data Access
         ↓
┌─────────────────────────┐
│  In-Memory Database     │
│                         │
│  • Users Map            │
│  • Missions Map         │
│  • Incidents Map        │
│  • Verifications Map    │
└─────────────────────────┘
         │
         │ JSON Response
         ↓
┌─────────────┐
│  User       │
│  Browser    │
└─────────────┘
```

---

## 🚀 Getting Started

1. **Start Server**
   ```bash
   npm start
   ```

2. **Test Endpoints**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Read Documentation**
   - API_DOCUMENTATION.md - Full reference
   - QUICK_REFERENCE.md - Quick commands

4. **Integrate with Frontend**
   - Use endpoints in login.html
   - Connect dashboard to API
   - Test all functionality

---

**API Version**: 1.0.0  
**Base URL**: http://localhost:3000  
**Status**: Production Ready ✅  
**Last Updated**: November 26, 2025
