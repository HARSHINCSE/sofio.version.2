const express = require('express');
const path = require('path');
const { PythonShell } = require('python-shell');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory databases (replace with actual DB in production)
const users = new Map();
const missions = new Map();
const incidents = new Map();
const verifications = new Map();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API endpoint for risk prediction
app.post('/api/predict', async (req, res) => {
  const { lat, lng } = req.body;

  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Call Python script with lat/lng as arguments
    const options = {
      mode: 'json',
      pythonPath: 'python', // Use 'python3' on Linux/Mac if needed
      scriptPath: __dirname,
      args: [lat.toString(), lng.toString()]
    };

    PythonShell.run('ai_predictor.py', options, (err, results) => {
      if (err) {
        console.error('Python script error:', err);
        return res.status(500).json({ error: 'Failed to get prediction' });
      }

      if (results && results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(500).json({ error: 'No prediction data returned' });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock news data generator
function generateLocalNews(lat, lng) {
  const newsCategories = [
    'Safety Alert', 'Traffic Update', 'Community Event', 'Crime Report',
    'Emergency Service', 'Road Closure', 'Public Notice', 'Weather Alert'
  ];
  
  const newsTemplates = [
    {
      category: 'Safety Alert',
      titles: [
        'Increased police presence in area',
        'Street lighting maintenance scheduled',
        'Community safety meeting announced',
        'New security cameras installed'
      ]
    },
    {
      category: 'Traffic Update',
      titles: [
        'Road construction on Main Street',
        'Traffic delays expected this evening',
        'Parking restrictions in effect',
        'New bike lane opened'
      ]
    },
    {
      category: 'Crime Report',
      titles: [
        'Theft reported in nearby area',
        'Vandalism incident under investigation',
        'Suspicious activity reported',
        'Property damage case closed'
      ]
    },
    {
      category: 'Community Event',
      titles: [
        'Neighborhood watch meeting tonight',
        'Community cleanup event this weekend',
        'Local festival happening nearby',
        'Public safety workshop scheduled'
      ]
    },
    {
      category: 'Emergency Service',
      titles: [
        'Fire department response in area',
        'Medical emergency handled',
        'Utility work completed',
        'Emergency services drill conducted'
      ]
    }
  ];
  
  const news = [];
  const numNews = Math.floor(Math.random() * 5) + 3; // 3-7 news items
  
  for (let i = 0; i < numNews; i++) {
    const category = newsCategories[Math.floor(Math.random() * newsCategories.length)];
    const template = newsTemplates.find(t => t.category === category) || newsTemplates[0];
    const title = template.titles[Math.floor(Math.random() * template.titles.length)];
    
    // Generate location within 1-2km radius
    const radiusKm = 1 + Math.random(); // 1-2 km
    const angle = Math.random() * 2 * Math.PI;
    const offsetLat = (radiusKm / 111) * Math.cos(angle); // ~111 km per degree
    const offsetLng = (radiusKm / (111 * Math.cos(lat * Math.PI / 180))) * Math.sin(angle);
    
    const newsLat = lat + offsetLat;
    const newsLng = lng + offsetLng;
    
    // Generate time (within last 24 hours)
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const timeAgo = hoursAgo > 0 ? `${hoursAgo}h ${minutesAgo}m ago` : `${minutesAgo}m ago`;
    
    news.push({
      id: i + 1,
      title: title,
      category: category,
      location: {
        lat: newsLat,
        lng: newsLng,
        address: `${Math.floor(Math.random() * 1000)} ${['Main St', 'Oak Ave', 'Park Blvd', 'First St', 'Second Ave'][Math.floor(Math.random() * 5)]}`
      },
      distance: (radiusKm * 1000).toFixed(0), // in meters
      timeAgo: timeAgo,
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      description: `${title} in the local area. Authorities are monitoring the situation.`
    });
  }
  
  // Sort by distance (closest first)
  news.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  
  return news;
}

// API endpoint for local news
app.get('/api/news', (req, res) => {
  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  try {
    const newsLat = parseFloat(lat);
    const newsLng = parseFloat(lng);
    const news = generateLocalNews(newsLat, newsLng);
    
    res.json({
      success: true,
      location: { lat: newsLat, lng: newsLng },
      radius: '1-2 km',
      news: news,
      count: news.length
    });
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// Register user
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  const userId = crypto.randomBytes(8).toString('hex');
  
  const user = {
    id: userId,
    email,
    password: hashedPassword,
    firstName,
    lastName,
    createdAt: new Date(),
    profile: {
      phone: '',
      location: '',
      bio: '',
      avatar: '👤'
    },
    stats: {
      missionsCompleted: 0,
      communityVerified: 0,
      trustScore: 5.0
    }
  };
  
  users.set(email, user);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    userId,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = users.get(email);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
  if (user.password !== hashedPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Generate simple token
  const token = crypto.randomBytes(32).toString('hex');
  
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      stats: user.stats
    }
  });
});

// Get user profile
app.get('/api/users/:email', (req, res) => {
  const { email } = req.params;
  const user = users.get(email);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profile: user.profile,
      stats: user.stats,
      createdAt: user.createdAt
    }
  });
});

// Update user profile
app.put('/api/users/:email/profile', (req, res) => {
  const { email } = req.params;
  const { firstName, lastName, phone, location, bio } = req.body;
  
  const user = users.get(email);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.profile.phone = phone;
  if (location) user.profile.location = location;
  if (bio) user.profile.bio = bio;
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profile: user.profile
    }
  });
});

// ==================== MISSIONS ENDPOINTS ====================

// Get all missions
app.get('/api/missions', (req, res) => {
  const missionsList = Array.from(missions.values());
  
  res.json({
    success: true,
    count: missionsList.length,
    missions: missionsList
  });
});

// Create new mission
app.post('/api/missions', (req, res) => {
  const { title, description, location, type, priority, volunteers, endDate } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const missionId = crypto.randomBytes(8).toString('hex');
  const mission = {
    id: missionId,
    title,
    description,
    location: location || { lat: 12.9716, lng: 77.5946 },
    type: type || 'monitoring',
    priority: priority || 'medium',
    status: 'active',
    volunteersNeeded: volunteers || 5,
    volunteersJoined: 0,
    endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  };
  
  missions.set(missionId, mission);
  
  res.status(201).json({
    success: true,
    message: 'Mission created successfully',
    mission
  });
});

// Join mission
app.post('/api/missions/:id/join', (req, res) => {
  const { id } = req.params;
  const mission = missions.get(id);
  
  if (!mission) {
    return res.status(404).json({ error: 'Mission not found' });
  }
  
  if (mission.volunteersJoined < mission.volunteersNeeded) {
    mission.volunteersJoined += 1;
    res.json({
      success: true,
      message: 'Successfully joined mission',
      mission
    });
  } else {
    res.status(400).json({ error: 'Mission is full' });
  }
});

// ==================== INCIDENTS ENDPOINTS ====================

// Report incident
app.post('/api/incidents/report', (req, res) => {
  const { title, description, location, category, severity } = req.body;
  
  if (!title || !description || !location) {
    return res.status(400).json({ error: 'Title, description, and location are required' });
  }
  
  const incidentId = crypto.randomBytes(8).toString('hex');
  const incident = {
    id: incidentId,
    title,
    description,
    location,
    category: category || 'other',
    severity: severity || 'medium',
    status: 'reported',
    verifications: 0,
    reports: 1,
    createdAt: new Date()
  };
  
  incidents.set(incidentId, incident);
  
  res.status(201).json({
    success: true,
    message: 'Incident reported successfully',
    incident
  });
});

// Get incidents
app.get('/api/incidents', (req, res) => {
  const incidentsList = Array.from(incidents.values());
  
  res.json({
    success: true,
    count: incidentsList.length,
    incidents: incidentsList
  });
});

// Verify incident
app.post('/api/incidents/:id/verify', (req, res) => {
  const { id } = req.params;
  const incident = incidents.get(id);
  
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  
  incident.verifications += 1;
  
  res.json({
    success: true,
    message: 'Incident verified',
    incident
  });
});

// ==================== RISK PREDICTION ====================

// Enhanced risk prediction
app.post('/api/predict-risk', (req, res) => {
  const { lat, lng, timeOfDay } = req.body;
  
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  try {
    // Calculate mock risk score based on location
    const baseRisk = Math.random() * 100;
    const timeModifier = timeOfDay === 'night' ? 1.3 : (timeOfDay === 'evening' ? 1.15 : 1.0);
    const riskScore = Math.min(100, baseRisk * timeModifier);
    
    const riskLevel = riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : riskScore < 80 ? 'High' : 'Severe';
    
    res.json({
      success: true,
      location: { lat, lng },
      riskScore: riskScore.toFixed(2),
      riskLevel,
      factors: [
        { factor: 'Historical incidents', weight: 40, impact: 'High' },
        { factor: 'Time of day', weight: 25, impact: timeModifier > 1.2 ? 'High' : 'Medium' },
        { factor: 'Crowd density', weight: 20, impact: 'Medium' },
        { factor: 'Lighting', weight: 15, impact: 'Low' }
      ],
      recommendation: riskScore > 70 ? 'Avoid non-essential travel' : riskScore > 50 ? 'Stay aware' : 'Safe',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Risk prediction error:', error);
    res.status(500).json({ error: 'Failed to calculate risk' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date(),
    version: '1.0.0',
    uptime: process.uptime(),
    database: {
      users: users.size,
      missions: missions.size,
      incidents: incidents.size
    }
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ==================== SERVER START ====================

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 NxtGenGuard server running on http://localhost:${PORT}`);
  console.log(`📍 Ready to predict safety risks!`);
  console.log(`📰 News dashboard enabled!`);
});


