import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, Tooltip } from 'react-leaflet';
import { AlertTriangle, Bug, Scan, Activity, CloudRain, Droplets, X, Camera, CheckCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Mock Data for Satellite NDVI (Vegetation Health) ---
// Simulating a grid of farm plots with different health indices
const NDVI_PLOTS = [
  { positions: [[22.95, 75.85], [22.95, 75.90], [22.90, 75.90], [22.90, 75.85]], health: 0.8, status: 'Healthy' }, // Green
  { positions: [[22.95, 75.90], [22.95, 75.95], [22.90, 75.95], [22.90, 75.90]], health: 0.4, status: 'Stressed (Water)' }, // Yellow
  { positions: [[22.90, 75.85], [22.90, 75.90], [22.85, 75.90], [22.85, 75.85]], health: 0.2, status: 'Critical (Pest)' }, // Red
  { positions: [[22.90, 75.90], [22.90, 75.95], [22.85, 75.95], [22.85, 75.90]], health: 0.6, status: 'Moderate' }, // Light Green
];

const getColorForNDVI = (health) => {
  if (health > 0.7) return '#22c55e'; // Green
  if (health > 0.5) return '#a3e635'; // Lime
  if (health > 0.3) return '#facc15'; // Yellow
  return '#ef4444'; // Red
};

// --- AI Diagnosis Mock Result ---
const MOCK_DIAGNOSIS = {
  disease: "Soybean Rust (Phakopsora pachyrhizi)",
  confidence: "94%",
  severity: "Moderate",
  symptoms: "Small, water-soaked lesions on leaves turning reddish-brown.",
  treatment: [
    "Apply fungicide: Azoxystrobin or Tebuconazole immediately.",
    "Ensure proper spacing between plants for air circulation.",
    "Monitor neighboring plants for spread."
  ]
};

const CropHealthMonitor = () => {
  const [viewMode, setViewMode] = useState('pest'); // 'pest' or 'ndvi'
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [reports, setReports] = useState([
    { id: 1, lat: 22.91, lng: 75.88, pest: 'Aphids', severity: 'High' },
    { id: 2, lat: 22.94, lng: 75.92, pest: 'White Fly', severity: 'Medium' },
    { id: 3, lat: 22.88, lng: 75.86, pest: 'Stem Borer', severity: 'Low' },
  ]);

  // Simulate AI Scan Process
  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanResult(MOCK_DIAGNOSIS);
    }, 2500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      
      {/* Left Panel: Controls & Advisories */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        
        {/* 1. Mode Switcher */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Activity className="text-green-600" /> Monitoring Layer
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('pest')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${viewMode === 'pest' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Bug size={16} /> Pest Outbreaks
            </button>
            <button 
              onClick={() => setViewMode('ndvi')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${viewMode === 'ndvi' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Scan size={16} /> Satellite (NDVI)
            </button>
          </div>
        </div>

        {/* 2. AI Doctor Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Scan className="text-blue-200" /> AI Crop Doctor
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Detect diseases instantly. Upload a photo of your affected crop for diagnosis.
            </p>
            <button 
              onClick={() => setShowScanner(true)}
              className="w-full bg-white text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Camera size={18} /> Start Diagnosis
            </button>
          </div>
          {/* Decorative Background */}
          <Bug className="absolute -bottom-4 -right-4 text-blue-500/30 w-32 h-32" />
        </div>

        {/* 3. Real-time Advisories */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" /> Live Advisories
          </h3>
          
          <div className="space-y-3">
            {/* Weather Alert */}
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-blue-800 text-sm">High Humidity Alert</h4>
                <CloudRain size={14} className="text-blue-500" />
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Humidity &gt; 85% predicted. High risk of fungal growth in Soybean. Avoid evening irrigation.
              </p>
            </div>

            {/* Pest Alert */}
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-red-800 text-sm">Aphid Outbreak Nearby</h4>
                <Bug size={14} className="text-red-500" />
              </div>
              <p className="text-xs text-red-700 mt-1">
                35 farmers in Indore district reported Aphid attacks today. Scout your field immediately.
              </p>
            </div>

            {/* General Advice */}
            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-green-800 text-sm">Nutrient Management</h4>
                <Droplets size={14} className="text-green-500" />
              </div>
              <p className="text-xs text-green-700 mt-1">
                Crop is in flowering stage. Apply 2% Urea spray for better pod formation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Map Visualization */}
      <div className="w-full lg:w-2/3 bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 relative h-[600px]">
        <MapContainer center={[22.92, 75.90]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />
          
          {/* Layer 1: Pest Heatmap */}
          {viewMode === 'pest' && reports.map(report => (
            <CircleMarker 
              key={report.id}
              center={[report.lat, report.lng]}
              radius={20}
              pathOptions={{ 
                color: report.severity === 'High' ? 'red' : 'orange',
                fillColor: report.severity === 'High' ? 'red' : 'orange',
                fillOpacity: 0.6
              }}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-red-600">{report.pest} Detected</h4>
                  <p className="text-xs">Severity: {report.severity}</p>
                  <p className="text-xs text-gray-500">Reported: 2 hrs ago</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Layer 2: Satellite NDVI Polygons */}
          {viewMode === 'ndvi' && NDVI_PLOTS.map((plot, idx) => (
            <Polygon 
              key={idx}
              positions={plot.positions}
              pathOptions={{ 
                color: getColorForNDVI(plot.health), 
                fillColor: getColorForNDVI(plot.health), 
                fillOpacity: 0.5,
                weight: 1
              }}
            >
              <Tooltip sticky>
                <div className="text-xs">
                  <p className="font-bold">Plot #{idx + 1}</p>
                  <p>Health Index: {plot.health}</p>
                  <p>Status: {plot.status}</p>
                </div>
              </Tooltip>
            </Polygon>
          ))}

          {/* Legend Overlay */}
          {/* Note: In React Leaflet v4, standard HTML elements inside MapContainer are rendered as children of the container div, 
              but they might cause issues if they capture events. We'll keep it simple for now. */}
          <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control leaflet-bar bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg text-xs m-4">
              <h4 className="font-bold mb-2">{viewMode === 'pest' ? 'Pest Severity' : 'Vegetation Health (NDVI)'}</h4>
              <div className="space-y-1">
                {viewMode === 'pest' ? (
                  <>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> High Risk</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Medium Risk</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Low Risk</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500"></div> Healthy (&gt;0.7)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400"></div> Moderate (0.4-0.7)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500"></div> Stressed (&lt;0.4)</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </MapContainer>
      </div>

      {/* AI Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/80 z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl duration-200">
            
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Scan size={20} /> AI Disease Diagnosis
              </h3>
              <button onClick={() => { setShowScanner(false); setScanResult(null); }} className="hover:bg-blue-700 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!scanResult ? (
                <div className="text-center space-y-6">
                  {!scanning ? (
                    <>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer" onClick={handleScan}>
                        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Click to Upload or Take Photo</p>
                        <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG</p>
                      </div>
                      <button 
                        onClick={handleScan}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Analyze Crop
                      </button>
                    </>
                  ) : (
                    <div className="py-12">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-blue-800 font-bold animate-pulse">Analyzing Leaf Patterns...</p>
                      <p className="text-xs text-gray-500 mt-2">Checking against 50,000+ disease samples</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="">
                  <div className="flex items-center gap-3 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertTriangle className="text-red-600 w-8 h-8" />
                    <div>
                      <h4 className="font-bold text-red-800 text-lg">{scanResult.disease}</h4>
                      <p className="text-xs text-red-600 font-bold">Confidence: {scanResult.confidence} • Severity: {scanResult.severity}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-bold text-gray-700 mb-1">Symptoms Detected:</h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{scanResult.symptoms}</p>
                    </div>

                    <div>
                      <h5 className="text-sm font-bold text-gray-700 mb-2">Recommended Treatment:</h5>
                      <ul className="space-y-2">
                        {scanResult.treatment.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Order Medicine
                      </button>
                      <button 
                        onClick={() => { setScanResult(null); }}
                        className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-200 text-sm"
                      >
                        Scan Another
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CropHealthMonitor;
