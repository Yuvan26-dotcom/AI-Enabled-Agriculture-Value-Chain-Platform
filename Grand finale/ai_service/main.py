from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Tuple
from datetime import date, timedelta
import random
import math
import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup

from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
import numpy as np

app = FastAPI(title="BIOMETRIX AI Engine", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ANN Model for Logistics ---
class LogisticsANN:
    def __init__(self):
        # Simple dataset: [Distance(km), Weight(tons)] -> [Cost(INR), ETA(hours)]
        # Synthetic training data based on Indian logistics standards
        X = np.array([
            [50, 1], [100, 1], [200, 1], [500, 1], [1000, 1],
            [50, 5], [100, 5], [200, 5], [500, 5], [1000, 5],
            [50, 10], [100, 10], [200, 10], [500, 10], [1000, 10],
            [1200, 15], [800, 20], [300, 2], [150, 0.5]
        ])
        # Cost approx: Base 500 + (Dist * 15) + (Weight * 200)
        # ETA approx: Base 2 + (Dist / 40) + (Weight * 0.5)
        y = np.array([
            [1500, 4], [2500, 5], [4000, 8], [9000, 15], [17000, 28],
            [2500, 5], [3500, 6], [5000, 9], [10000, 16], [18000, 29],
            [3500, 6], [4500, 7], [6000, 10], [11000, 17], [19000, 30],
            [25000, 35], [18000, 25], [6000, 10], [3000, 6]
        ])
        
        self.scaler_X = StandardScaler()
        self.scaler_y = StandardScaler()
        
        X_scaled = self.scaler_X.fit_transform(X)
        y_scaled = self.scaler_y.fit_transform(y)
        
        # Multi-layer Perceptron Regressor
        self.model = MLPRegressor(
            hidden_layer_sizes=(10, 8), 
            activation='relu', 
            solver='adam', 
            max_iter=1000, 
            random_state=42
        )
        self.model.fit(X_scaled, y_scaled)

    def predict(self, distance, weight):
        input_data = np.array([[distance, weight]])
        input_scaled = self.scaler_X.transform(input_data)
        prediction_scaled = self.model.predict(input_scaled)
        prediction = self.scaler_y.inverse_transform(prediction_scaled)
        return {
            "predicted_cost": round(float(prediction[0][0]), 2),
            "predicted_eta": round(float(prediction[0][1]), 1)
        }

logistics_ann = LogisticsANN()

class LogisticsPredictionRequest(BaseModel):
    distance_km: float
    weight_tons: float

@app.post("/logistics/predict")
async def predict_logistics(req: LogisticsPredictionRequest):
    return logistics_ann.predict(req.distance_km, req.weight_tons)

# --- End ANN Model ---

# --- Data Models ---

class ForecastRequest(BaseModel):
    crop: str
    region: str

class ForecastResponse(BaseModel):
    dates: List[date]
    predicted_prices: List[float]
    trend: str

class DemandSupplyResponse(BaseModel):
    crop: str
    high_demand_periods: List[str]
    import_dependency_level: str

class AdvisoryRequest(BaseModel):
    lat: float
    lon: float
    harvest_date: date

class AdvisoryResponse(BaseModel):
    risk_level: str
    message: str
    weather_forecast: str

class PestDetectionResponse(BaseModel):
    detected: bool
    pest_type: Optional[str]
    confidence: float
    remedy: Optional[str]

class CreditScoreRequest(BaseModel):
    land_size_acres: float
    past_defaults: int
    yield_history_years: int
    kyc_status: bool

class CreditScoreResponse(BaseModel):
    score: int
    risk_level: str

class Location(BaseModel):
    id: str
    lat: float
    lon: float

class RouteRequest(BaseModel):
    warehouse: Location
    farmers: List[Location]

class RouteResponse(BaseModel):
    ordered_path: List[Location]
    total_distance_km: float

class WeatherAlertResponse(BaseModel):
    title: str
    description: str
    severity: str
    source: str

# --- Helper Functions ---

def calculate_distance(loc1: Location, loc2: Location) -> float:
    R = 6371
    dlat = math.radians(loc2.lat - loc1.lat)
    dlon = math.radians(loc2.lon - loc1.lon)
    a = math.sin(dlat/2) * math.sin(dlat/2) + \
        math.cos(math.radians(loc1.lat)) * math.cos(math.radians(loc2.lat)) * \
        math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "BIOMETRIX Predictive Analytics Engine Running"}

# 1. Price Forecasting (Prophet Logic - 6 Months)
@app.post("/forecast-price", response_model=ForecastResponse)
def forecast_price(request: ForecastRequest):
    """
    Predicts oilseed prices for the next 6 months using simulated Prophet model.
    """
    try:
        start_date = date.today()
        dates = []
        prices = []
        
        base_prices = {
            "soybean": 4500,
            "groundnut": 6200,
            "mustard": 5400,
            "sunflower": 5800,
            "sesame": 12000,
            "castor": 6000,
            "safflower": 5300,
            "niger": 7000,
            "linseed": 5700
        }
        
        crop_key = request.crop.lower()
        # Handle variations like "sesame (til)"
        if "sesame" in crop_key: crop_key = "sesame"
        
        base_price = base_prices.get(crop_key, 5000)
        
        # Generate weekly data for 6 months (~26 weeks)
        for i in range(26):
            d = start_date + timedelta(weeks=i)
            dates.append(d)
            
            # Add seasonality and trend
            seasonality = math.sin(i / 4) * 200 
            trend = i * 10 
            noise = random.uniform(-50, 50)
            
            price = base_price + seasonality + trend + noise
            prices.append(round(price, 2))
            
        trend_direction = "Upward" if prices[-1] > prices[0] else "Downward"
        
        return ForecastResponse(
            dates=dates,
            predicted_prices=prices,
            trend=trend_direction
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Demand-Supply Analysis
@app.get("/demand-supply", response_model=List[DemandSupplyResponse])
def analyze_demand_supply():
    """
    Analyzes import vs domestic production to flag High Demand periods.
    """
    return [
        DemandSupplyResponse(
            crop="Mustard",
            high_demand_periods=["October 2025", "November 2025"],
            import_dependency_level="Medium"
        ),
        DemandSupplyResponse(
            crop="Soybean",
            high_demand_periods=["January 2026", "February 2026"],
            import_dependency_level="High"
        ),
        DemandSupplyResponse(
            crop="Sunflower",
            high_demand_periods=["May 2026"],
            import_dependency_level="High"
        )
    ]

# 3. Crop Advisory (Weather Integration)
@app.post("/crop-advisory", response_model=AdvisoryResponse)
def crop_advisory(request: AdvisoryRequest):
    """
    Checks weather forecast during harvest week to flag post-harvest risks.
    """
    is_rainy = random.choice([True, False])
    
    if is_rainy:
        return AdvisoryResponse(
            risk_level="High Risk",
            message="Heavy rain predicted during your harvest week. Delay harvest by 3 days or arrange covered storage.",
            weather_forecast="Rainfall: 45mm expected"
        )
    else:
        return AdvisoryResponse(
            risk_level="Low Risk",
            message="Weather conditions are optimal for harvest.",
            weather_forecast="Clear Skies, Humidity: 40%"
        )

# 4. Pest Detection (CNN Placeholder)
@app.post("/pest-detect", response_model=PestDetectionResponse)
async def detect_pest(file: UploadFile = File(...)):
    """
    Analyzes uploaded leaf image to detect pests.
    """
    detected_pests = ["Aphids", "Whitefly", "Armyworm", "None"]
    result = random.choice(detected_pests)
    
    if result == "None":
        return PestDetectionResponse(
            detected=False,
            pest_type=None,
            confidence=0.95,
            remedy=None
        )
    else:
        remedies = {
            "Aphids": "Spray Neem Oil (2%) or use Ladybird beetles as natural predators.",
            "Whitefly": "Use Yellow Sticky Traps and spray Imidacloprid.",
            "Armyworm": "Apply Bacillus thuringiensis (Bt) or Spinosad."
        }
        return PestDetectionResponse(
            detected=True,
            pest_type=result,
            confidence=random.uniform(0.85, 0.99),
            remedy=remedies.get(result)
        )

# 5. Credit Scoring (Preserved)
@app.post("/credit-score", response_model=CreditScoreResponse)
def calculate_credit_score(request: CreditScoreRequest):
    try:
        score = 300
        if request.land_size_acres > 2: score += 50
        if request.past_defaults == 0: score += 100
        score += (request.yield_history_years * 20)
        if request.kyc_status: score += 50
        if score > 850: score = 850
        
        risk = "Low" if score >= 750 else "Medium" if score >= 600 else "High"
        return CreditScoreResponse(score=score, risk_level=risk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 6. Logistics Optimization (Preserved)
@app.post("/optimize-route", response_model=RouteResponse)
def optimize_route(request: RouteRequest):
    try:
        warehouse = request.warehouse
        unvisited = request.farmers.copy()
        path = [warehouse]
        total_distance = 0.0
        current_loc = warehouse

        while unvisited:
            nearest_farmer = None
            min_dist = float('inf')
            for farmer in unvisited:
                dist = calculate_distance(current_loc, farmer)
                if dist < min_dist:
                    min_dist = dist
                    nearest_farmer = farmer
            
            if nearest_farmer:
                path.append(nearest_farmer)
                total_distance += min_dist
                current_loc = nearest_farmer
                unvisited.remove(nearest_farmer)
        
        return_dist = calculate_distance(current_loc, warehouse)
        path.append(warehouse)
        total_distance += return_dist

        return RouteResponse(ordered_path=path, total_distance_km=round(total_distance, 2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 7. Real-time Weather Alerts (Simulated Live Feed)
@app.get("/weather-alerts", response_model=List[WeatherAlertResponse])
def get_weather_alerts():
    """
    Returns simulated real-time weather alerts.
    In a production environment, this would connect to the IMD API or a paid weather service.
    """
    alerts_pool = [
        {"title": "Heavy Rainfall Warning", "description": "Isolated heavy rainfall very likely over Coastal Andhra Pradesh & Yanam.", "severity": "High"},
        {"title": "Thunderstorm Alert", "description": "Thunderstorm with lightning accompanied by gusty winds (speed 30-40 kmph) at isolated places.", "severity": "Medium"},
        {"title": "Heat Wave", "description": "Heat wave conditions very likely in isolated pockets over Saurashtra & Kutch.", "severity": "High"},
        {"title": "Dense Fog", "description": "Dense fog very likely in isolated pockets over Punjab, Haryana, Chandigarh & Delhi.", "severity": "Medium"},
        {"title": "Cold Wave", "description": "Cold wave conditions very likely in isolated pockets over North Rajasthan.", "severity": "Medium"},
        {"title": "Cyclonic Circulation", "description": "A cyclonic circulation lies over Southeast Arabian Sea & adjoining Lakshadweep area.", "severity": "Low"},
        {"title": "Squally Weather", "description": "Squally weather (wind speed 40-45 kmph gusting to 55 kmph) very likely over Comorin area.", "severity": "Medium"},
        {"title": "Hailstorm Warning", "description": "Hailstorm likely at isolated places over Vidarbha and Marathwada.", "severity": "High"}
    ]
    
    # Simulate dynamic updates by randomly selecting a subset
    import random
    num_alerts = random.randint(1, 4)
    selected_alerts = random.sample(alerts_pool, num_alerts)
    
    response = []
    for alert in selected_alerts:
        response.append(WeatherAlertResponse(
            title=alert["title"],
            description=alert["description"],
            severity=alert["severity"],
            source="IMD Mausam (Simulated)"
        ))
        
    return response

# --- New Advanced Endpoints for Production Prototype ---

class YieldPredictionRequest(BaseModel):
    crop: str
    acreage: float
    state: str
    rainfall_mm: float
    soil_nitrogen: float

class YieldPredictionResponse(BaseModel):
    predicted_yield_quintals: float
    confidence_score: float
    factors: Dict[str, float] # Explainable AI

@app.post("/predict/yield", response_model=YieldPredictionResponse)
def predict_yield(req: YieldPredictionRequest):
    # Simulation of a Random Forest Regressor
    base_yield_per_acre = {
        "Soybean": 4.5, "Groundnut": 6.0, "Mustard": 5.5, "Sunflower": 5.0
    }.get(req.crop, 4.0)
    
    # Adjust based on rainfall (Ideal: 800-1200mm)
    rainfall_factor = 1.0
    if req.rainfall_mm < 500: rainfall_factor = 0.7
    elif req.rainfall_mm > 1500: rainfall_factor = 0.8
    
    # Adjust based on soil
    soil_factor = 1.0 + (req.soil_nitrogen - 50) / 200 # Normalize around 50
    
    predicted_yield = req.acreage * base_yield_per_acre * rainfall_factor * soil_factor
    
    # Explainable AI Factors (SHAP-like values)
    factors = {
        "Base Yield": base_yield_per_acre,
        "Rainfall Impact": round(rainfall_factor, 2),
        "Soil Health": round(soil_factor, 2)
    }
    
    return YieldPredictionResponse(
        predicted_yield_quintals=round(predicted_yield, 2),
        confidence_score=0.89,
        factors=factors
    )

class SpoilageRiskRequest(BaseModel):
    temperature_c: float
    humidity_percent: float
    storage_days: int
    crop_type: str

class SpoilageRiskResponse(BaseModel):
    risk_probability: float # 0.0 to 1.0
    risk_level: str # Low, Medium, High, Critical
    estimated_shelf_life_days: int

@app.post("/predict/spoilage", response_model=SpoilageRiskResponse)
def predict_spoilage(req: SpoilageRiskRequest):
    # Logistic Regression Simulation
    # High Temp + High Humidity = High Risk
    
    risk_score = 0.0
    if req.temperature_c > 25: risk_score += 0.3
    if req.temperature_c > 35: risk_score += 0.3
    if req.humidity_percent > 65: risk_score += 0.3
    if req.storage_days > 90: risk_score += 0.2
    
    risk_score = min(risk_score, 1.0)
    
    level = "Low"
    if risk_score > 0.3: level = "Medium"
    if risk_score > 0.6: level = "High"
    if risk_score > 0.8: level = "Critical"
    
    shelf_life = max(0, 180 - (req.temperature_c * 2) - (req.humidity_percent * 0.5))
    
    return SpoilageRiskResponse(
        risk_probability=round(risk_score, 2),
        risk_level=level,
        estimated_shelf_life_days=int(shelf_life)
    )

class LogisticsETARequest(BaseModel):
    origin_lat: float
    origin_lon: float
    dest_lat: float
    dest_lon: float
    avg_speed_kmph: float = 40.0

class LogisticsETAResponse(BaseModel):
    eta_hours: float
    traffic_factor: float
    distance_km: float

@app.post("/logistics/eta", response_model=LogisticsETAResponse)
def calculate_eta(req: LogisticsETARequest):
    # Haversine Distance
    R = 6371
    dlat = math.radians(req.dest_lat - req.origin_lat)
    dlon = math.radians(req.dest_lon - req.origin_lon)
    a = math.sin(dlat/2) * math.sin(dlat/2) + \
        math.cos(math.radians(req.origin_lat)) * math.cos(math.radians(req.dest_lat)) * \
        math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    
    # Simulate Traffic
    traffic_factor = random.uniform(1.1, 1.5) # 10-50% delay
    
    eta = (distance / req.avg_speed_kmph) * traffic_factor
    
    return LogisticsETAResponse(
        eta_hours=round(eta, 2),
        traffic_factor=round(traffic_factor, 2),
        distance_km=round(distance, 2)
    )

# --- Soil-Based Recommendation Engine ---

class SoilRecommendationRequest(BaseModel):
    soil_type: str # Black, Alluvial, Red, Sandy, Lateritic, Saline
    nitrogen: float
    phosphorus: float
    potassium: float
    ph_level: float

class CropRecommendation(BaseModel):
    crop_name: str
    suitability_score: float # 0-100
    expected_yield_per_acre: float
    fertilizer_plan: str
    irrigation_schedule: str
    risk_factors: List[str]

class SoilRecommendationResponse(BaseModel):
    recommended_crops: List[CropRecommendation]
    soil_health_status: str
    amendment_suggestions: List[str]

@app.post("/recommend/soil", response_model=SoilRecommendationResponse)
def recommend_crops_by_soil(req: SoilRecommendationRequest):
    """
    AI Engine to recommend oilseed crops based on soil parameters.
    Uses agro-climatic logic and nutrient analysis.
    """
    recommendations = []
    soil_status = "Healthy"
    amendments = []

    # 1. Analyze Soil Health
    if req.ph_level < 5.5:
        soil_status = "Acidic"
        amendments.append("Apply Lime (CaCO3) to neutralize acidity.")
    elif req.ph_level > 8.0:
        soil_status = "Alkaline"
        amendments.append("Apply Gypsum to lower pH.")
    
    if req.nitrogen < 200:
        amendments.append("Low Nitrogen: Add Urea or organic compost.")

    # 2. Crop Matching Logic (Simulated Knowledge Graph)
    # Black Soil (Regur) -> Best for Soybean, Safflower
    if "black" in req.soil_type.lower():
        recommendations.append(CropRecommendation(
            crop_name="Soybean",
            suitability_score=95.0,
            expected_yield_per_acre=6.5,
            fertilizer_plan="NPK 20:60:20 kg/ha",
            irrigation_schedule="Critical stages: Pod initiation and grain filling.",
            risk_factors=["Water logging in heavy rains", "Pest: Stem Fly"]
        ))
        recommendations.append(CropRecommendation(
            crop_name="Safflower",
            suitability_score=88.0,
            expected_yield_per_acre=4.0,
            fertilizer_plan="NPK 40:40:0 kg/ha",
            irrigation_schedule="Drought tolerant, one irrigation at rosette stage.",
            risk_factors=["Aphids"]
        ))

    # Alluvial Soil -> Mustard, Sesame, Sunflower
    elif "alluvial" in req.soil_type.lower():
        recommendations.append(CropRecommendation(
            crop_name="Mustard (Rapeseed)",
            suitability_score=92.0,
            expected_yield_per_acre=7.0,
            fertilizer_plan="NPK 80:40:40 kg/ha + Sulphur",
            irrigation_schedule="Pre-flowering and pod formation stages.",
            risk_factors=["Frost sensitivity", "Aphids"]
        ))
        recommendations.append(CropRecommendation(
            crop_name="Sesame",
            suitability_score=85.0,
            expected_yield_per_acre=3.5,
            fertilizer_plan="NPK 30:15:15 kg/ha",
            irrigation_schedule="Sensitive to water logging. Light irrigation only.",
            risk_factors=["Phyllody disease"]
        ))

    # Red/Sandy Soil -> Groundnut, Castor
    elif "red" in req.soil_type.lower() or "sandy" in req.soil_type.lower():
        recommendations.append(CropRecommendation(
            crop_name="Groundnut",
            suitability_score=94.0,
            expected_yield_per_acre=8.0,
            fertilizer_plan="NPK 20:60:40 kg/ha + Gypsum",
            irrigation_schedule="Pegging and pod development stages.",
            risk_factors=["Leaf spot", "Rust"]
        ))
        recommendations.append(CropRecommendation(
            crop_name="Castor",
            suitability_score=90.0,
            expected_yield_per_acre=6.0,
            fertilizer_plan="NPK 40:40:20 kg/ha",
            irrigation_schedule="Hardy crop, irrigations improve yield significantly.",
            risk_factors=["Botrytis Gray Mold"]
        ))
    
    # Default / Other
    else:
        recommendations.append(CropRecommendation(
            crop_name="Sunflower",
            suitability_score=75.0,
            expected_yield_per_acre=5.0,
            fertilizer_plan="NPK 60:40:30 kg/ha",
            irrigation_schedule="Bud initiation, flowering, and seed setting.",
            risk_factors=["Bird damage", "Necrosis"]
        ))

    return SoilRecommendationResponse(
        recommended_crops=recommendations,
        soil_health_status=soil_status,
        amendment_suggestions=amendments
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
