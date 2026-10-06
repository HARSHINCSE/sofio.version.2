#!/usr/bin/env python3
"""
AI-Powered Safety Risk Predictor
Simulates realistic risk prediction based on time, location, and random events
"""

import sys
import json
import random
import math
from datetime import datetime

def calculate_time_risk():
    """Calculate risk multiplier based on time of day"""
    now = datetime.now()
    hour = now.hour
    
    # Higher risk between 10 PM (22) and 5 AM (5)
    if hour >= 22 or hour < 5:
        return 1.5  # 50% higher risk at night
    elif hour >= 20 or hour < 7:
        return 1.2  # 20% higher risk in evening/early morning
    else:
        return 0.8  # Lower risk during day

def generate_random_event():
    """Simulate random safety events that spike risk in certain areas"""
    # 30% chance of a random event
    if random.random() < 0.3:
        return {
            'lat': random.uniform(-0.05, 0.05),  # Offset from center
            'lng': random.uniform(-0.05, 0.05),
            'intensity': random.uniform(0.3, 0.6)  # Risk multiplier
        }
    return None

def calculate_distance(lat1, lng1, lat2, lng2):
    """Calculate distance between two points (Haversine formula)"""
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

def calculate_base_risk(lat, lng, time_multiplier, event):
    """Calculate base risk score for user's location"""
    base_risk = random.uniform(20, 40)  # Base risk 20-40
    
    # Apply time multiplier
    base_risk *= time_multiplier
    
    # Apply event proximity if event exists
    if event:
        distance = calculate_distance(lat, lng, lat + event['lat'], lng + event['lng'])
        if distance < 2:  # Within 2km of event
            proximity_factor = max(0, 1 - (distance / 2))
            base_risk += event['intensity'] * 40 * proximity_factor
    
    # Add some randomness
    base_risk += random.uniform(-5, 15)
    
    # Clamp between 0 and 100
    return max(0, min(100, base_risk))

def generate_risk_zones(user_lat, user_lng, num_zones, time_multiplier, event):
    """Generate 40-60 risk zones around the user's location"""
    zones = []
    num_zones = random.randint(40, 60)
    
    for _ in range(num_zones):
        # Generate random offset (within ~5km radius)
        offset_lat = random.uniform(-0.045, 0.045)  # ~5km
        offset_lng = random.uniform(-0.045, 0.045)
        
        zone_lat = user_lat + offset_lat
        zone_lng = user_lng + offset_lng
        
        # Calculate risk for this zone
        zone_risk = random.uniform(10, 50) * time_multiplier
        
        # Check if zone is near an event
        if event:
            distance = calculate_distance(zone_lat, zone_lng, 
                                         user_lat + event['lat'], 
                                         user_lng + event['lng'])
            if distance < 1.5:
                zone_risk += event['intensity'] * 30
        
        # Add some variation
        zone_risk += random.uniform(-10, 20)
        zone_risk = max(0, min(100, zone_risk))
        
        zones.append({
            'lat': zone_lat,
            'lng': zone_lng,
            'risk': round(zone_risk, 1)
        })
    
    return zones

def main():
    """Main prediction function"""
    if len(sys.argv) < 3:
        print(json.dumps({
            'error': 'Latitude and longitude required'
        }))
        sys.exit(1)
    
    try:
        user_lat = float(sys.argv[1])
        user_lng = float(sys.argv[2])
    except ValueError:
        print(json.dumps({
            'error': 'Invalid latitude or longitude'
        }))
        sys.exit(1)
    
    # Calculate time-based risk multiplier
    time_multiplier = calculate_time_risk()
    
    # Generate random event (if any)
    event = generate_random_event()
    
    # Calculate current risk for user's location
    current_risk = calculate_base_risk(user_lat, user_lng, time_multiplier, event)
    
    # Generate risk zones
    zones = generate_risk_zones(user_lat, user_lng, 50, time_multiplier, event)
    
    # Return JSON response
    result = {
        'currentRisk': round(current_risk, 1),
        'zones': zones
    }
    
    print(json.dumps(result))
    sys.stdout.flush()

if __name__ == '__main__':
    main()


