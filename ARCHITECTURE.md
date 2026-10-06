# Safio Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌────────────────┬──────────────┬──────────────┐               │
│  │  Login Page    │  Dashboard   │  Profile     │               │
│  │  (login.html)  │ (index.html) │ (profile.html)              │
│  └────────────────┴──────────────┴──────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                        HTTP/JSON API
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER (Node.js)                  │
│                     (server.js - Port 3000)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              MIDDLEWARE LAYER                          │   │
│  │  • Express.json() - Parse JSON requests               │   │
│  │  • Logger - Request logging                           │   │
│  │  • Error Handler - Centralized error handling         │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↓                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │           API ROUTE HANDLERS                           │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │                                                        │   │
│  │  ┌──────────────────┐  ┌──────────────────┐           │   │
│  │  │ AUTHENTICATION   │  │  USER MANAGEMENT │           │   │
│  │  ├──────────────────┤  ├──────────────────┤           │   │
│  │  │ POST /register   │  │ GET  /users      │           │   │
│  │  │ POST /login      │  │ PUT  /profile    │           │   │
│  │  └──────────────────┘  └──────────────────┘           │   │
│  │                                                        │   │
│  │  ┌──────────────────┐  ┌──────────────────┐           │   │
│  │  │ MISSIONS         │  │  INCIDENTS       │           │   │
│  │  ├──────────────────┤  ├──────────────────┤           │   │
│  │  │ GET  /missions   │  │ POST /report     │           │   │
│  │  │ POST /missions   │  │ GET  /incidents  │           │   │
│  │  │ POST /join       │  │ POST /verify     │           │   │
│  │  └──────────────────┘  └──────────────────┘           │   │
│  │                                                        │   │
│  │  ┌──────────────────┐  ┌──────────────────┐           │   │
│  │  │ RISK PREDICTION  │  │  NEWS            │           │   │
│  │  ├──────────────────┤  ├──────────────────┤           │   │
│  │  │ POST /predict    │  │ GET  /news       │           │   │
│  │  └──────────────────┘  └──────────────────┘           │   │
│  │                                                        │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ HEALTH CHECK     │                                │   │
│  │  ├──────────────────┤                                │   │
│  │  │ GET  /health     │                                │   │
│  │  └──────────────────┘                                │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↓                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │           BUSINESS LOGIC LAYER                         │   │
│  │  • User authentication & validation                    │   │
│  │  • Mission management & tracking                       │   │
│  │  • Incident verification & analysis                   │   │
│  │  • Risk calculation algorithms                        │   │
│  │  • News generation & filtering                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↓                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         DATA STORAGE LAYER (In-Memory)                │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐              │   │
│  │  │ USERS    │ │ MISSIONS │ │ INCIDENTS │              │   │
│  │  │ Database │ │ Database │ │ Database │              │   │
│  │  └──────────┘ └──────────┘ └──────────┘              │   │
│  │                                                        │   │
│  │  Future: PostgreSQL / MongoDB                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         EXTERNAL INTEGRATION (Optional)               │   │
│  │  • Python ML (ai_predictor.py) - Risk analysis        │   │
│  │  • Email Service - Notifications                      │   │
│  │  • Maps API - Location services                       │   │
│  │  • Weather API - Environmental data                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

```
┌──────────────────┐
│   User Action    │ (e.g., Login)
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────────┐
│  Frontend (JavaScript/HTML)          │
│  Sends HTTP POST to /api/auth/login  │
└────────┬─────────────────────────────┘
         │
         ↓ JSON Data
┌──────────────────────────────────────┐
│  Express.js Server (Port 3000)       │
│  - Receives request                  │
│  - Logs request                      │
│  - Routes to handler                 │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│  Middleware                          │
│  - Parse JSON body                   │
│  - Validate request                  │
│  - Add context                       │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│  Route Handler                       │
│  POST /api/auth/login                │
│  - Extract email & password          │
│  - Validate inputs                   │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│  Business Logic                      │
│  - Find user in database             │
│  - Hash password & compare           │
│  - Generate token                    │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│  Data Access Layer                   │
│  - Query in-memory storage           │
│  - Retrieve user info                │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│  Response Build                      │
│  {                                   │
│    success: true,                    │
│    token: "...",                     │
│    user: {...}                       │
│  }                                   │
└────────┬─────────────────────────────┘
         │
         ↓ JSON Response
┌──────────────────────────────────────┐
│  Frontend Receives Response           │
│  - Parse JSON                        │
│  - Store token & user info           │
│  - Redirect to dashboard             │
└──────────────────────────────────────┘
```

---

## File Organization

```
safecity-predictshield/
│
├── server.js                    ← Main backend entry point
│   ├── Middleware setup
│   ├── Routes & handlers
│   ├── Business logic
│   └── Server startup
│
├── package.json                 ← Dependencies & scripts
│   ├── express
│   ├── python-shell
│   ├── cors
│   └── dotenv
│
├── .env                        ← Configuration (gitignored)
│   ├── PORT
│   ├── DATABASE URLs
│   ├── API KEYS
│   └── SECRETS
│
├── public/                     ← Frontend files
│   ├── index.html
│   ├── login.html
│   ├── profile.html
│   ├── style.css
│   └── script.js
│
├── ai_predictor.py            ← Python ML integration
│
└── Documentation
    ├── API_DOCUMENTATION.md   ← Full API reference
    ├── BACKEND_SETUP.md       ← Setup & deployment
    ├── BACKEND_SUMMARY.md     ← Feature overview
    └── QUICK_REFERENCE.md     ← Quick commands
```

---

## Data Models

### User Object
```javascript
{
  id: "uuid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  profile: {
    phone: "+1-555-1234",
    location: "San Francisco, USA",
    bio: "Safety coordinator",
    avatar: "👤"
  },
  stats: {
    missionsCompleted: 24,
    communityVerified: 156,
    trustScore: 4.8
  },
  createdAt: "2025-11-26T10:00:00Z"
}
```

### Mission Object
```javascript
{
  id: "uuid",
  title: "Night Ops — Marina Grid",
  description: "Community safety patrol",
  location: {
    lat: 12.9716,
    lng: 77.5946
  },
  type: "monitoring",
  priority: "high",
  status: "active",
  volunteersNeeded: 5,
  volunteersJoined: 3,
  endDate: "2025-12-03T23:59:59Z",
  createdAt: "2025-11-26T10:00:00Z"
}
```

### Incident Object
```javascript
{
  id: "uuid",
  title: "Suspicious Activity",
  description: "Group of individuals near park",
  location: {
    lat: 12.9716,
    lng: 77.5946,
    address: "Park Street"
  },
  category: "suspicious_activity",
  severity: "medium",
  status: "reported",
  verifications: 5,
  reports: 1,
  createdAt: "2025-11-26T10:45:00Z"
}
```

---

## API Response Structure

### Success Response (200/201)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "key": "value"
  },
  "timestamp": "2025-11-26T10:50:00Z"
}
```

### Error Response (400/401/404/500)
```json
{
  "error": "Error description",
  "status": 400,
  "details": "Additional information",
  "timestamp": "2025-11-26T10:50:00Z"
}
```

---

## Technology Stack

```
Frontend                Backend                 Data
┌─────────────┐        ┌─────────────┐        ┌──────────────┐
│   HTML5     │        │  Node.js    │        │ In-Memory    │
│   CSS3      │◄─────►│  Express.js │◄─────►│ (Dev)        │
│   JavaScript│        │  JavaScript │        │              │
│   Leaflet   │        │             │        │ PostgreSQL   │
│   (Maps)    │        │ Python ML   │        │ (Production) │
│             │        │ (Optional)  │        │              │
└─────────────┘        └─────────────┘        └──────────────┘
     HTTP/S                REST API              SQL/NoSQL
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│      Public Internet                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Layer 1: Input Validation               │
│ - Type checking                         │
│ - Format validation                     │
│ - Range checking                        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Layer 2: Authentication                 │
│ - Token verification (Future: JWT)      │
│ - User identification                   │
│ - Session management                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Layer 3: Authorization                  │
│ - Permission checking                   │
│ - Role-based access                     │
│ - Data ownership verification           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Layer 4: Business Logic                 │
│ - Safe operations                       │
│ - Constraint enforcement                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Layer 5: Data Protection                │
│ - Encrypted passwords (Future)          │
│ - Data privacy                          │
│ - Secure storage                        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Database / File System             │
└─────────────────────────────────────────┘
```

---

## Deployment Architecture (Future)

```
┌──────────────────────────────────────────────────┐
│         Cloud Provider (AWS/Heroku/DigitalOcean)│
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │  CDN / Static Files                    │    │
│  │  (HTML, CSS, JS, Images)               │    │
│  └────────────────────────────────────────┘    │
│                     ↓                           │
│  ┌────────────────────────────────────────┐    │
│  │  Load Balancer                         │    │
│  │  (Distribute traffic)                  │    │
│  └────────────────────────────────────────┘    │
│                     ↓                           │
│  ┌─────┬────────────┬─────┐                    │
│  │     │            │     │                    │
│  ↓     ↓            ↓     ↓                    │
│ App   App          App   App                   │
│ Inst. Inst.        Inst. Inst.                 │
│ (Node.js Cluster)                             │
│                                                │
│  ┌────────────────────────────────────────┐    │
│  │  Message Queue (Optional)              │    │
│  │  (RabbitMQ / Redis)                    │    │
│  └────────────────────────────────────────┘    │
│                     ↓                           │
│  ┌────────────────────────────────────────┐    │
│  │  Database                              │    │
│  │  (PostgreSQL / MongoDB)                │    │
│  └────────────────────────────────────────┘    │
│                                                │
│  ┌────────────────────────────────────────┐    │
│  │  Cache Layer (Redis)                   │    │
│  │  (For performance)                     │    │
│  └────────────────────────────────────────┘    │
│                                                │
└──────────────────────────────────────────────────┘
```

---

**Architecture Last Updated**: November 26, 2025  
**Backend Version**: 1.0.0  
**Status**: Production-Ready ✅
