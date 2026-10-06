# Safio Backend API Documentation

## Base URL
```
http://localhost:3000
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "a1b2c3d4",
  "user": {
    "id": "a1b2c3d4",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Login User
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "a1b2c3d4",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "stats": {
      "missionsCompleted": 24,
      "communityVerified": 156,
      "trustScore": 4.8
    }
  }
}
```

---

## User Profile Endpoints

### Get User Profile
**GET** `/api/users/:email`

Response:
```json
{
  "success": true,
  "user": {
    "id": "a1b2c3d4",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profile": {
      "phone": "+1-555-123-4567",
      "location": "San Francisco, USA",
      "bio": "Safety coordinator with 3+ years experience",
      "avatar": "👤"
    },
    "stats": {
      "missionsCompleted": 24,
      "communityVerified": 156,
      "trustScore": 4.8
    },
    "createdAt": "2025-11-26T10:30:00Z"
  }
}
```

---

### Update User Profile
**PUT** `/api/users/:email/profile`

Request:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1-555-987-6543",
  "location": "New York, USA",
  "bio": "Updated bio here"
}
```

Response:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "a1b2c3d4",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "profile": {
      "phone": "+1-555-987-6543",
      "location": "New York, USA",
      "bio": "Updated bio here"
    }
  }
}
```

---

## Missions Endpoints

### Get All Missions
**GET** `/api/missions`

Response:
```json
{
  "success": true,
  "count": 5,
  "missions": [
    {
      "id": "m1a2b3c4",
      "title": "Night Ops — Marina Grid Patrol",
      "description": "Co-monitor sensors and crowd signals",
      "location": {
        "lat": 12.9716,
        "lng": 77.5946
      },
      "type": "monitoring",
      "priority": "high",
      "status": "active",
      "volunteersNeeded": 5,
      "volunteersJoined": 3,
      "endDate": "2025-12-03T23:59:59Z",
      "createdAt": "2025-11-26T10:00:00Z"
    }
  ]
}
```

---

### Create Mission
**POST** `/api/missions`

Request:
```json
{
  "title": "Safety Patrol — Downtown Area",
  "description": "Community safety patrol in downtown zone",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "type": "patrol",
  "priority": "high",
  "volunteers": 10,
  "endDate": "2025-12-10T23:59:59Z"
}
```

Response:
```json
{
  "success": true,
  "message": "Mission created successfully",
  "mission": {
    "id": "m1a2b3c4",
    "title": "Safety Patrol — Downtown Area",
    "status": "active",
    "volunteersNeeded": 10,
    "volunteersJoined": 0,
    "createdAt": "2025-11-26T10:30:00Z"
  }
}
```

---

### Join Mission
**POST** `/api/missions/:id/join`

Response:
```json
{
  "success": true,
  "message": "Successfully joined mission",
  "mission": {
    "id": "m1a2b3c4",
    "volunteersJoined": 4
  }
}
```

---

## Incidents Endpoints

### Report Incident
**POST** `/api/incidents/report`

Request:
```json
{
  "title": "Suspicious Activity",
  "description": "Group of individuals near park entrance",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946,
    "address": "Park Street, Downtown"
  },
  "category": "suspicious_activity",
  "severity": "medium"
}
```

Response:
```json
{
  "success": true,
  "message": "Incident reported successfully",
  "incident": {
    "id": "i1a2b3c4",
    "title": "Suspicious Activity",
    "status": "reported",
    "verifications": 0,
    "reports": 1,
    "createdAt": "2025-11-26T10:45:00Z"
  }
}
```

---

### Get Incidents
**GET** `/api/incidents`

Response:
```json
{
  "success": true,
  "count": 3,
  "incidents": [
    {
      "id": "i1a2b3c4",
      "title": "Suspicious Activity",
      "description": "Group of individuals near park entrance",
      "status": "reported",
      "category": "suspicious_activity",
      "severity": "medium",
      "verifications": 5,
      "reports": 1,
      "createdAt": "2025-11-26T10:45:00Z"
    }
  ]
}
```

---

### Verify Incident
**POST** `/api/incidents/:id/verify`

Response:
```json
{
  "success": true,
  "message": "Incident verified",
  "incident": {
    "id": "i1a2b3c4",
    "verifications": 6
  }
}
```

---

## Risk Prediction Endpoints

### Predict Risk Score
**POST** `/api/predict-risk`

Request:
```json
{
  "lat": 12.9716,
  "lng": 77.5946,
  "timeOfDay": "night"
}
```

Response:
```json
{
  "success": true,
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "riskScore": "67.45",
  "riskLevel": "High",
  "factors": [
    {
      "factor": "Historical incidents",
      "weight": 40,
      "impact": "High"
    },
    {
      "factor": "Time of day",
      "weight": 25,
      "impact": "High"
    },
    {
      "factor": "Crowd density",
      "weight": 20,
      "impact": "Medium"
    },
    {
      "factor": "Lighting",
      "weight": 15,
      "impact": "Low"
    }
  ],
  "recommendation": "Avoid non-essential travel",
  "timestamp": "2025-11-26T22:30:00Z"
}
```

---

## News Endpoints

### Get Local News
**GET** `/api/news?lat=12.9716&lng=77.5946`

Response:
```json
{
  "success": true,
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "radius": "1-2 km",
  "count": 4,
  "news": [
    {
      "id": 1,
      "title": "Increased police presence in area",
      "category": "Safety Alert",
      "location": {
        "lat": 12.9720,
        "lng": 77.5950,
        "address": "Main Street"
      },
      "distance": "450",
      "timeAgo": "2h 30m ago",
      "severity": "medium",
      "description": "Increased police presence in area. Authorities are monitoring the situation."
    }
  ]
}
```

---

## Health Check Endpoint

### Server Health
**GET** `/api/health`

Response:
```json
{
  "success": true,
  "status": "online",
  "timestamp": "2025-11-26T10:50:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "database": {
    "users": 5,
    "missions": 3,
    "incidents": 8
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "All fields are required",
  "status": 400
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid email or password",
  "status": 401
}
```

### 404 Not Found
```json
{
  "error": "User not found",
  "status": 404
}
```

### 409 Conflict
```json
{
  "error": "User already exists",
  "status": 409
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details",
  "status": 500
}
```

---

## Running the Server

```bash
# Install dependencies
npm install

# Start the server
npm start

# The server will be available at http://localhost:3000
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- User authentication is currently using basic token generation (upgrade to JWT for production)
- Data is stored in-memory (replace with database for production)
- CORS is enabled for development (configure for production)
