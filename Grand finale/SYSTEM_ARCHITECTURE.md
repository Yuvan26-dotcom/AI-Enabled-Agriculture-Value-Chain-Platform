# System Architecture & Design Document

## 1. Overview
This document outlines the architecture for the **Unified Digital Agriculture Platform for Oilseeds**. The system is designed to be production-ready, scalable, and modular, integrating real-time data, AI decision support, and blockchain traceability.

## 2. System Architecture

### 2.1 Microservices Design
The backend is structured into modular services to ensure separation of concerns:

*   **API Gateway (Node.js/Express)**: Handles all client requests, authentication, and routing.
*   **AI Engine (Python/FastAPI)**: Dedicated service for heavy computational tasks (Yield Prediction, Soil Analysis).
*   **Geo-Spatial Service**: Manages State -> District -> Crop mappings and GIS data.
*   **Real-Time Ingestion**: Simulates streaming data from IoT sensors and market APIs.

### 2.2 Tech Stack
*   **Frontend**: React.js (Vite), Tailwind CSS, Recharts.
*   **Backend**: Node.js (Express), Python (FastAPI).
*   **Database**: 
    *   **PostgreSQL** (Planned): For structured relational data (Users, Farms).
    *   **TimescaleDB** (Planned): For time-series sensor data.
*   **Containerization**: Docker & Docker Compose.

## 3. Core Features & Implementation Details

### 3.1 Dynamic State -> District -> Oilseed Mapping
*   **Endpoint**: `/api/geo/districts/:state` and `/api/geo/oilseeds/:state/:district`
*   **Logic**: The system maintains a hierarchical mapping of agro-climatic zones. When a user selects a state, the district list updates dynamically. Selecting a district filters the available oilseed crops based on actual production data.

### 3.2 Real-Time Data Integration
*   **Mechanism**: The frontend uses a polling mechanism (5s interval) to fetch "live" data from the backend.
*   **Data Points**:
    *   **Mandi Prices**: Simulated fluctuation based on base MSP + random market noise.
    *   **Weather**: Real-time temperature and humidity simulation.
    *   **Soil Moisture**: Telemetry data simulation.

### 3.3 Soil-Based AI Recommendation Engine
*   **Endpoint**: `/api/soil/recommend/soil` (Proxies to AI Service)
*   **Logic**:
    *   **Input**: Soil Type (Black, Red, Alluvial, etc.), N-P-K values, pH.
    *   **Processing**: Rule-based expert system combined with nutrient analysis.
    *   **Output**: Recommended crops with suitability scores, fertilizer plans, and risk factors.

### 3.4 Production Analytics
*   **Visualization**: Interactive line charts showing 5-year yield trends.
*   **Data Source**: Mocked historical datasets representing government agricultural census data.

## 4. API Specifications

### 4.1 Geo-Spatial APIs
*   `GET /api/geo/states`: List all states.
*   `GET /api/geo/districts/:state`: List districts for a state.
*   `GET /api/geo/oilseeds/:state/:district`: List crops for a district.

### 4.2 AI APIs
*   `POST /api/ai/predict/yield`: Predict crop yield.
*   `POST /api/soil/recommend/soil`: Get crop recommendations based on soil health.

### 4.3 Analytics APIs
*   `GET /api/geo/analytics/production/:crop`: Get historical yield data.

## 5. Deployment Guide

### 5.1 Prerequisites
*   Node.js v18+
*   Python 3.9+
*   Docker Desktop

### 5.2 Running Locally
1.  **Start Backend**: `cd server && npm start` (Runs on Port 5000)
2.  **Start AI Service**: `cd ai_service && uvicorn main:app --reload` (Runs on Port 8000)
3.  **Start Client**: `cd client && npm run dev` (Runs on Port 5173)

### 5.3 Production Build
1.  **Frontend**: `npm run build` -> Serves static files via Nginx.
2.  **Backend**: Use PM2 for process management (`pm2 start server.js`).
3.  **AI Service**: Use Gunicorn with Uvicorn workers (`gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`).

## 6. Future Roadmap
*   **Kafka Integration**: Replace polling with true event streaming.
*   **Satellite Imagery**: Integrate Sentinel-2 API for remote sensing.
*   **Mobile App**: React Native build for farmers.
