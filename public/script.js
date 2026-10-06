// NxtGenGuard - AI-Powered Safety Mapping System
// Main application logic

let map;
let heatLayer;
let userMarker;
let currentLocation = null;
let updateInterval = null;
let heatData = [];
const searchHints = [
    'Safe Hub pop-up',
    'Nightwatch meetup',
    'Marina grid mission',
    'Transit hub patrol',
    'Harbor drone sweep',
    'Neighborhood audit',
    'Emergency drill',
    'Beacon deployment'
];

// Initialize the application
async function init() {
    try {
        // Initialize map
        initMap();
        
        // Get user's current location
        await getUserLocation();
        
        // Hide loading overlay
        setTimeout(() => {
            document.getElementById('loading-overlay').classList.add('hidden');
        }, 1000);
        
        // Start periodic updates
        startAutoUpdate();
        
        // Add click handler for map
        map.on('click', handleMapClick);
        
        // Initialize news dashboard
        initNewsDashboard();

        // Landing interactions
        initLandingInteractions();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize NxtGenGuard. Please refresh the page.');
    }
}

// Initialize Leaflet map
function initMap() {
    // Default location (San Francisco) if geolocation fails
    const defaultLat = 37.7749;
    const defaultLng = -122.4194;
    
    map = L.map('map', {
        center: [defaultLat, defaultLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: true
    });
    
    // Add OpenStreetMap tiles with dark theme
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Initialize heat layer (will be populated later)
    heatLayer = L.layerGroup().addTo(map);
}

// Get user's current location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            // Fallback to default location
            currentLocation = { lat: 37.7749, lng: -122.4194 };
            map.setView([currentLocation.lat, currentLocation.lng], 14);
            updateLocationText(currentLocation.lat, currentLocation.lng);
            resolve();
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                map.setView([currentLocation.lat, currentLocation.lng], 14);
                updateLocationText(currentLocation.lat, currentLocation.lng);
                
                // Add user marker
                if (userMarker) {
                    userMarker.setLatLng([currentLocation.lat, currentLocation.lng]);
                } else {
                    userMarker = L.marker([currentLocation.lat, currentLocation.lng], {
                        icon: L.divIcon({
                            className: 'user-marker',
                            html: '<div style="width: 20px; height: 20px; background: #667eea; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);"></div>',
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        })
                    }).addTo(map);
                }
                
                // Fetch initial risk data
                fetchRiskData(currentLocation.lat, currentLocation.lng);
                
                // Fetch initial news
                fetchLocalNews(currentLocation.lat, currentLocation.lng);
                
                resolve();
            },
            (error) => {
                console.warn('Geolocation error:', error);
                // Fallback to default location
                currentLocation = { lat: 37.7749, lng: -122.4194 };
                map.setView([currentLocation.lat, currentLocation.lng], 14);
                updateLocationText(currentLocation.lat, currentLocation.lng);
                fetchRiskData(currentLocation.lat, currentLocation.lng);
                fetchLocalNews(currentLocation.lat, currentLocation.lng);
                resolve();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// Handle map click to recalculate risk
async function handleMapClick(e) {
    const clickedLat = e.latlng.lat;
    const clickedLng = e.latlng.lng;
    
    currentLocation = { lat: clickedLat, lng: clickedLng };
    
    // Update user marker
    if (userMarker) {
        userMarker.setLatLng([clickedLat, clickedLng]);
    } else {
        userMarker = L.marker([clickedLat, clickedLng], {
            icon: L.divIcon({
                className: 'user-marker',
                html: '<div style="width: 20px; height: 20px; background: #667eea; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(map);
    }
    
    // Update location text
    updateLocationText(clickedLat, clickedLng);
    
    // Fetch new risk data
    await fetchRiskData(clickedLat, clickedLng);
    
    // Fetch news for new location
    fetchLocalNews(clickedLat, clickedLng);
    
    // Pan to clicked location
    map.panTo([clickedLat, clickedLng]);
}

// Fetch risk prediction data from server
async function fetchRiskData(lat, lng) {
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lat, lng })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch risk data');
        }
        
        const data = await response.json();
        
        // Update UI with risk data
        updateRiskDisplay(data.currentRisk);
        
        // Update heatmap
        updateHeatmap(data.zones);
        
        // Update timestamp
        updateTimestamp();
        
    } catch (error) {
        console.error('Error fetching risk data:', error);
        showError('Failed to get risk prediction. Retrying...');
        
        // Retry after 2 seconds
        setTimeout(() => {
            if (currentLocation) {
                fetchRiskData(currentLocation.lat, currentLocation.lng);
            }
        }, 2000);
    }
}

// Update risk display in UI
function updateRiskDisplay(risk) {
    const riskValue = document.getElementById('risk-value');
    const riskFill = document.getElementById('risk-fill');
    const riskStatus = document.getElementById('risk-status');
    const statusIndicator = document.getElementById('status-indicator');
    
    // Update risk value
    riskValue.textContent = Math.round(risk);
    
    // Update risk bar fill
    riskFill.style.width = `${risk}%`;
    
    // Remove all classes
    riskValue.classList.remove('warning', 'danger');
    riskFill.classList.remove('warning', 'danger');
    riskStatus.classList.remove('warning', 'danger');
    statusIndicator.classList.remove('warning', 'danger');
    
    // Determine risk level and apply styles
    if (risk >= 70) {
        // High risk
        riskValue.classList.add('danger');
        riskFill.classList.add('danger');
        riskStatus.classList.add('danger');
        statusIndicator.classList.add('danger');
        riskStatus.textContent = '⚠️ HIGH RISK';
    } else if (risk >= 40) {
        // Medium risk
        riskValue.classList.add('warning');
        riskFill.classList.add('warning');
        riskStatus.classList.add('warning');
        statusIndicator.classList.add('warning');
        riskStatus.textContent = '⚡ CAUTION';
    } else {
        // Low risk
        riskStatus.textContent = '✓ SAFE';
    }
}

// Update heatmap with risk zones
function updateHeatmap(zones) {
    // Clear existing heat layer
    heatLayer.clearLayers();
    heatData = [];
    
    // Prepare heat data points
    zones.forEach(zone => {
        // Weight is based on risk (0-100)
        // Higher risk = higher intensity
        const intensity = zone.risk / 100;
        
        heatData.push([
            zone.lat,
            zone.lng,
            intensity
        ]);
        
        // Add glowing markers for high-risk zones (risk > 70)
        if (zone.risk > 70) {
            const marker = L.circleMarker([zone.lat, zone.lng], {
                radius: 8,
                fillColor: '#ef4444',
                color: '#ffffff',
                weight: 2,
                opacity: 0.9,
                fillOpacity: 0.7
            }).addTo(heatLayer);
            
            // Add glow effect class
            marker.getElement().classList.add('high-risk-zone');
        }
    });
    
    // Create heat layer using Leaflet.heat if available, otherwise use circles
    if (typeof L.heatLayer !== 'undefined') {
        // Use Leaflet.heat plugin
        const heat = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            max: 1.0,
            gradient: {
                0.0: 'green',
                0.3: 'yellow',
                0.6: 'orange',
                1.0: 'red'
            }
        });
        
        heatLayer.addLayer(heat);
    } else {
        // Fallback: use colored circles
        heatData.forEach(point => {
            const [lat, lng, intensity] = point;
            const risk = intensity * 100;
            
            let color = '#4ade80'; // green
            if (risk >= 70) color = '#ef4444'; // red
            else if (risk >= 40) color = '#fbbf24'; // yellow
            
            const circle = L.circleMarker([lat, lng], {
                radius: Math.max(3, intensity * 15),
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 0.6,
                fillOpacity: Math.max(0.2, intensity * 0.8)
            }).addTo(heatLayer);
            
            if (risk > 70) {
                circle.getElement().classList.add('high-risk-zone');
            }
        });
    }
}

// Update location text
function updateLocationText(lat, lng) {
    const locationText = document.getElementById('location-text');
    locationText.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Update timestamp
function updateTimestamp() {
    const updateTime = document.getElementById('update-time');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    updateTime.textContent = timeString;
}

// Start automatic updates every 5 seconds
function startAutoUpdate() {
    // Initial update
    if (currentLocation) {
        fetchRiskData(currentLocation.lat, currentLocation.lng);
    }
    
    // Set up interval
    updateInterval = setInterval(() => {
        if (currentLocation) {
            fetchRiskData(currentLocation.lat, currentLocation.lng);
        }
    }, 5000); // 5 seconds
}

// Show error message
function showError(message) {
    const riskStatus = document.getElementById('risk-status');
    riskStatus.textContent = `⚠️ ${message}`;
    riskStatus.classList.add('danger');
}

// Watch for geolocation updates (if user moves)
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const newLat = position.coords.latitude;
            const newLng = position.coords.longitude;
            
            // Only update if location changed significantly (>50m)
            if (currentLocation) {
                const distance = calculateDistance(
                    currentLocation.lat,
                    currentLocation.lng,
                    newLat,
                    newLng
                );
                
                if (distance > 0.05) { // ~50 meters
                    currentLocation = { lat: newLat, lng: newLng };
                    updateLocationText(newLat, newLng);
                    
                    if (userMarker) {
                        userMarker.setLatLng([newLat, newLng]);
                    }
                    
                    fetchRiskData(newLat, newLng);
                    fetchLocalNews(newLat, newLng);
                    map.panTo([newLat, newLng]);
                }
            }
        },
        (error) => {
            console.warn('Geolocation watch error:', error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 5000
        }
    );
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Initialize news dashboard
function initNewsDashboard() {
    const refreshBtn = document.getElementById('refresh-news-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (currentLocation) {
                fetchLocalNews(currentLocation.lat, currentLocation.lng, true);
            }
        });
    }
}

// Fetch local news within 1-2km radius
async function fetchLocalNews(lat, lng, showLoading = false) {
    const newsContent = document.getElementById('news-content');
    
    if (showLoading) {
        newsContent.innerHTML = `
            <div class="news-loading">
                <div class="news-spinner"></div>
                <p>Refreshing news...</p>
            </div>
        `;
    }
    
    try {
        const response = await fetch(`/api/news?lat=${lat}&lng=${lng}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        
        if (data.news && data.news.length > 0) {
            displayNews(data.news);
        } else {
            newsContent.innerHTML = `
                <div class="news-empty">
                    No recent news in your area
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContent.innerHTML = `
            <div class="news-empty">
                Failed to load news. Please try again.
            </div>
        `;
    }
}

// Display news items
function displayNews(newsItems) {
    const newsContent = document.getElementById('news-content');
    
    if (!newsItems || newsItems.length === 0) {
        newsContent.innerHTML = `
            <div class="news-empty">
                No recent news in your area
            </div>
        `;
        return;
    }
    
    const newsHTML = newsItems.map(item => {
        const categoryClass = getCategoryClass(item.category);
        const distanceText = parseFloat(item.distance) < 1000 
            ? `${item.distance}m away` 
            : `${(parseFloat(item.distance) / 1000).toFixed(1)}km away`;
        
        return `
            <div class="news-item" onclick="showNewsOnMap(${item.location.lat}, ${item.location.lng})">
                <div class="news-item-header">
                    <span class="news-category ${categoryClass}">${item.category}</span>
                    <span class="news-time">${item.timeAgo}</span>
                </div>
                <div class="news-title">${item.title}</div>
                <div class="news-meta">
                    <span class="news-distance">${distanceText}</span>
                    <span>${item.location.address}</span>
                </div>
            </div>
        `;
    }).join('');
    
    newsContent.innerHTML = newsHTML;
}

// Get CSS class for news category
function getCategoryClass(category) {
    const categoryMap = {
        'Safety Alert': 'safety',
        'Traffic Update': 'traffic',
        'Crime Report': 'crime',
        'Community Event': 'community',
        'Emergency Service': 'emergency'
    };
    
    return categoryMap[category] || 'default';
}

// Show news location on map
function showNewsOnMap(lat, lng) {
    if (map) {
        map.setView([lat, lng], 16, {
            animate: true,
            duration: 0.5
        });
        
        // Add a temporary marker
        const newsMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'news-marker',
                html: '<div style="width: 16px; height: 16px; background: #667eea; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            })
        }).addTo(map);
        
        // Remove marker after 3 seconds
        setTimeout(() => {
            map.removeLayer(newsMarker);
        }, 3000);
    }
}

// Make showNewsOnMap available globally
window.showNewsOnMap = showNewsOnMap;

// Landing page interactions
function initLandingInteractions() {
    setupSearchSuggestions();
    setupConfettiButtons();
    const joinBtn = document.getElementById('join-vibe-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', (event) => {
            triggerConfetti(event.clientX, event.clientY);
            const mapSection = document.getElementById('map');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}

function setupSearchSuggestions() {
    const searchInput = document.getElementById('event-search');
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!searchInput || !suggestionsBox) return;

    const renderSuggestions = (value = '') => {
        const filtered = searchHints.filter((hint) =>
            hint.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);

        if (!filtered.length) {
            suggestionsBox.classList.remove('active');
            return;
        }

        suggestionsBox.innerHTML = filtered
            .map((hint) => `<div class="search-suggestion">${hint}</div>`)
            .join('');
        suggestionsBox.classList.add('active');
    };

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value.length === 0) {
            renderSuggestions('');
        } else {
            renderSuggestions(value);
        }
    });

    searchInput.addEventListener('focus', () => renderSuggestions(searchInput.value));

    suggestionsBox.addEventListener('click', (event) => {
        if (event.target.classList.contains('search-suggestion')) {
            searchInput.value = event.target.textContent;
            suggestionsBox.classList.remove('active');
        }
    });

    document.addEventListener('click', (event) => {
        if (!suggestionsBox.contains(event.target) && event.target !== searchInput) {
            suggestionsBox.classList.remove('active');
        }
    });
}

function setupConfettiButtons() {
    const confettiButtons = document.querySelectorAll('[data-confetti]');
    confettiButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            triggerConfetti(rect.left + rect.width / 2, rect.top);
        });
    });
}

function triggerConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    for (let i = 0; i < 18; i++) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        const offsetX = x + window.scrollX + (Math.random() * 80 - 40);
        const offsetY = y + window.scrollY;
        piece.style.left = `${offsetX}px`;
        piece.style.top = `${offsetY}px`;
        piece.style.background = ['#d4af37', '#f5d47c', '#ff6b6b', '#60a5fa'][Math.floor(Math.random() * 4)];
        piece.style.animationDelay = `${Math.random() * 0.2}s`;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 2000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

