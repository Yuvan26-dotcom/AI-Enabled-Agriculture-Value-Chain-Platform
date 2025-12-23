# Unified Digital Agriculture Platform for Oilseed Supply Chain - Design Document

## 1. Executive Summary
This document outlines the architecture, design, and implementation details for a production-grade digital agriculture platform. The system integrates real-time IoT data, AI-driven decision support, blockchain traceability, and national Agri-Stack integration to optimize the oilseed supply chain from farm to fork.

## 2. System Architecture

### 2.1 High-Level Architecture
The system follows a **Microservices Architecture** to ensure scalability, fault tolerance, and independent deployment of components.

```mermaid
graph TD
    Client[Web/Mobile Clients] --> API_Gateway[API Gateway / Load Balancer]
    API_Gateway --> Auth_Service[Auth Service (Node.js)]
    API_Gateway --> Core_Service[Core Business Service (Node.js)]
    API_Gateway --> AI_Service[AI Engine (Python/FastAPI)]
    API_Gateway --> Logistics_Service[Logistics Service (Node.js)]
    
    Core_Service --> DB[(PostgreSQL/TimescaleDB)]
    Core_Service --> Blockchain[Blockchain Connector]
    Blockchain --> Ledger[(Hyperledger/Ethereum)]
    
    AI_Service --> Model_Registry[Model Registry]
    AI_Service --> Feature_Store[Feature Store]
    
    IoT_Gateway[IoT Gateway] --> MQTT_Broker[MQTT Broker (VerneMQ/Mosquitto)]
    MQTT_Broker --> Ingestion_Service[Data Ingestion Service]
    Ingestion_Service --> Kafka[Apache Kafka]
    Kafka --> Stream_Processor[Stream Processor (Spark/Flink)]
    Stream_Processor --> DB
    Stream_Processor --> AI_Service
```

### 2.2 Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Recharts, Leaflet Maps.
- **Backend Gateway & Core**: Node.js (Express), JWT Authentication.
- **AI/ML Engine**: Python (FastAPI), Scikit-learn, TensorFlow, Pandas.
- **Database**: 
  - **Primary**: PostgreSQL (Relational Data: Users, Farms, Orders).
  - **Time-Series**: TimescaleDB (Sensor Data, Price History).
  - **Cache**: Redis (Session Store, Real-time Leaderboards).
- **Message Bus**: Apache Kafka (Event Streaming) / RabbitMQ (Task Queues).
- **Blockchain**: Hyperledger Fabric (Private Permissioned) or Ethereum (Public Traceability).
- **Infrastructure**: Docker, Kubernetes (K8s), Nginx.

## 3. Core Modules & Features

### 3.1 Real-Time Data Integration
- **Ingestion**: Supports MQTT for IoT sensors (moisture, temperature) and HTTP Webhooks for partner APIs.
- **Pipeline**: 
  1. **Raw Ingest**: Data lands in Kafka topic `iot-raw`.
  2. **Validation**: Schema registry checks, range checks (e.g., Moisture 0-100%).
  3. **Processing**: Windowed aggregation (5-min averages) for dashboards.
  4. **Storage**: Persisted to TimescaleDB.

### 3.2 AI-Powered Decision Support
- **Yield Forecasting**: Regression models (Random Forest) using historical yield + weather data.
- **Spoilage Risk**: Classification model based on storage temp, humidity, and duration.
- **Logistics Optimization**: VRP (Vehicle Routing Problem) solver using OR-Tools.
- **Explainability**: SHAP values provided for every risk score to build trust.

### 3.3 Blockchain Traceability
- **Hybrid Model**: 
  - **Off-Chain**: Detailed documents (Lab reports, images) stored in IPFS/S3.
  - **On-Chain**: Hash of the document + Metadata (BatchID, Timestamp, Owner, Location).
- **Smart Contracts**: Automate payment release upon successful quality verification (Assayer approval).

### 3.4 Logistics & Warehouse Intelligence
- **Geo-Spatial Mapping**: All warehouses indexed with Lat/Lon and Capacity.
- **Route Optimization**: Dynamic re-routing based on traffic and spoilage risk.
- **Fleet Tracking**: Real-time GPS integration.

### 3.5 Agri-Stack Integration
- **Farmer ID**: OAuth2 integration with National Farmer Database.
- **Land Records**: API sync with State Land Record Servers (Bhoomi/Bhulekh).

## 4. Data Schema (Key Entities)

### 4.1 Database Schema (SQL)

```sql
CREATE TABLE farmers (
    id UUID PRIMARY KEY,
    agri_stack_id VARCHAR(50) UNIQUE,
    name VARCHAR(100),
    state VARCHAR(50),
    district VARCHAR(50),
    mobile VARCHAR(15)
);

CREATE TABLE crops (
    id UUID PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id),
    crop_type VARCHAR(50), -- Soybean, Mustard, etc.
    sowing_date DATE,
    expected_harvest_date DATE,
    acreage DECIMAL(10,2)
);

CREATE TABLE batches (
    batch_id VARCHAR(50) PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id),
    crop_id UUID REFERENCES crops(id),
    quantity_quintals DECIMAL(10,2),
    quality_grade VARCHAR(10),
    moisture_content DECIMAL(5,2),
    blockchain_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sensor_telemetry (
    time TIMESTAMPTZ NOT NULL,
    device_id VARCHAR(50),
    batch_id VARCHAR(50),
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    location_lat DECIMAL(9,6),
    location_lon DECIMAL(9,6)
);
SELECT create_hypertable('sensor_telemetry', 'time');
```

## 5. API Specifications (OpenAPI/Swagger)

### 5.1 AI Service Endpoints
- `POST /predict/yield`: Predict harvest volume based on acreage and weather.
- `POST /predict/spoilage`: Calculate risk probability (0-100%) for a batch.
- `POST /logistics/optimize`: Input list of pickup points, output optimal route.

### 5.2 Core Service Endpoints
- `GET /api/trace/:batchId`: Get full blockchain history.
- `POST /api/logistics/update-location`: Receive GPS ping from truck.
- `GET /api/dashboard/policymaker`: Aggregate national stats.

## 6. Deployment & DevOps
- **Containerization**: All services defined in `docker-compose.yml`.
- **CI/CD**: GitHub Actions pipeline to run tests and push images to registry.
- **Monitoring**: Prometheus (Metrics) + Grafana (Visualization) + ELK Stack (Logs).

## 7. Roadmap
- **Phase 1 (MVP)**: Core Dashboard, Basic Traceability, Simulated AI. (Completed)
- **Phase 2**: Real IoT integration via MQTT, Blockchain Testnet deployment.
- **Phase 3**: National Agri-Stack API integration, Mobile App for Farmers.
