import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Truck, Home, Package, Navigation, MapPin, Clock, ShieldCheck, AlertTriangle, Brain, Calculator, Volume2 } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import ANNLogPanel from './ANNLogPanel';
import { ALL_INDIAN_STATES } from '../data/indian_states_coords';

// --- Icons ---
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2554/2554978.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const warehouseIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4481/4481127.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

// --- Constants ---
// Source: https://enam.gov.in/web/pop-dashboard/transportation/providers
const TRANSPORT_PROVIDERS = [
    "Rivigo Services", "Blackbuck (Zinka Logistics)", "Gati KWE", "V-Trans (India) Ltd", 
    "Safexpress Pvt Ltd", "TCI Freight", "Spoton Logistics", "Delhivery", "Blue Dart Express",
    "Mahindra Logistics", "Agarwal Packers and Movers", "VR Logistics", "Associated Road Carriers",
    "Om Logistics", "Future Supply Chain"
];

// --- Helpers ---
// Simple seeded random to make the map deterministic for the same district
const seededRandom = (seed) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

// Helper for curved route (Bezier)
const getCurvedRoute = (start, end, seed) => {
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;
    
    // Offset control point to create curve
    const offset = 0.05 * (seededRandom(seed) > 0.5 ? 1 : -1); 
    
    const controlLat = midLat + offset;
    const controlLng = midLng - offset;

    const points = [];
    const steps = 100;
    for (let t = 0; t <= 1; t += 1/steps) {
        const lat = (1 - t) * (1 - t) * start.lat + 2 * (1 - t) * t * controlLat + t * t * end.lat;
        const lng = (1 - t) * (1 - t) * start.lng + 2 * (1 - t) * t * controlLng + t * t * end.lng;
        points.push({ lat, lng });
    }
    return points;
};

const generateMockData = (state, district, crop) => {
    const stateCenter = ALL_INDIAN_STATES[state] || ALL_INDIAN_STATES['Madhya Pradesh'];
    
    // Generate a "District Center" by offsetting from State Center based on district name hash
    let hash = 0;
    for (let i = 0; i < district.length; i++) hash = district.charCodeAt(i) + ((hash << 5) - hash);
    
    // Normalize hash to offset (approx +/- 1.5 degrees)
    const latOffset = (seededRandom(hash) - 0.5) * 3; 
    const lngOffset = (seededRandom(hash + 1) - 0.5) * 3;
    
    const center = {
        lat: stateCenter.lat + latOffset,
        lng: stateCenter.lng + lngOffset
    };

    // Generate Warehouses around this center
    const warehouses = [];
    const numWarehouses = Math.floor(seededRandom(hash + 2) * 3) + 2; // 2 to 4 warehouses
    
    for (let i = 0; i < numWarehouses; i++) {
        const totalCap = Math.floor(seededRandom(hash + 30 + i) * 500) + 500;
        const filled = Math.floor(seededRandom(hash + 35 + i) * totalCap);
        warehouses.push({
            id: `WH-${i}`,
            name: `${district} Oilseed Depot ${String.fromCharCode(65 + i)}`,
            lat: center.lat + (seededRandom(hash + 10 + i) - 0.5) * 0.1,
            lng: center.lng + (seededRandom(hash + 20 + i) - 0.5) * 0.1,
            capacity: `${totalCap} MT`,
            filled: filled,
            total: totalCap,
            type: i % 2 === 0 ? "Cold Storage" : "Dry Storage"
        });
    }

    // Generate Active Trips
    const activeTrips = [];
    const numTrips = Math.floor(seededRandom(hash + 3) * 4) + 2; // 2 to 5 trips

    for (let i = 0; i < numTrips; i++) {
        const start = warehouses[i % warehouses.length];
        const endLat = center.lat + (seededRandom(hash + 40 + i) - 0.5) * 0.5;
        const endLng = center.lng + (seededRandom(hash + 50 + i) - 0.5) * 0.5;
        const distance = Math.floor(Math.sqrt(Math.pow(endLat - start.lat, 2) + Math.pow(endLng - start.lng, 2)) * 111); // Approx km
        const weight = Math.floor(seededRandom(hash + 60 + i) * 15) + 5;

        // Pick a provider from the eNAM list
        const providerIndex = Math.floor(seededRandom(hash + 70 + i) * TRANSPORT_PROVIDERS.length);
        const provider = TRANSPORT_PROVIDERS[providerIndex];

        // Create a realistic curved route
        const route = getCurvedRoute(start, { lat: endLat, lng: endLng }, hash + 100 + i);

        activeTrips.push({
            tripId: `TRIP-${1000 + i}`,
            truckNumber: `GJ-${10 + i}-AB-${1234 + i}`,
            driver: `Driver ${String.fromCharCode(65 + i)}`,
            provider: provider,
            status: "In Transit",
            cargo: `${crop} Seeds`,
            weight: weight,
            distance: distance,
            speed: `${Math.floor(seededRandom(hash + 90 + i) * 20) + 40} km/h`,
            eta: `${Math.floor(distance / 40)} hrs`, // Initial rough estimate
            ann_cost: Math.floor(distance * 15 + weight * 200), // Simulated ANN output
            ann_eta: (distance / 45).toFixed(1), // Simulated ANN output
            start: start,
            end: { lat: endLat, lng: endLng },
            route: route,
            progress: seededRandom(hash + 80 + i) * 100
        });
    }

    return { center, warehouses, activeTrips };
};

// Component to update map view when center changes
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
};

const LogisticsDashboard = ({ 
    selectedState = 'Madhya Pradesh', 
    setSelectedState,
    selectedDistrict = 'Indore',
    setSelectedDistrict,
    selectedCrop = 'Soybean',
    setSelectedCrop,
    voiceMode,
    speak
}) => {
    const { t } = useTranslation();
    const [data, setData] = useState({ center: ALL_INDIAN_STATES['Madhya Pradesh'], warehouses: [], activeTrips: [] });
    const [truckPositions, setTruckPositions] = useState({}); // Map of tripId -> current position
    const [animationStep, setAnimationStep] = useState(0);
    const [focusedTrip, setFocusedTrip] = useState(null);

    // 1. Generate Data on Location Change
    useEffect(() => {
        const newData = generateMockData(selectedState, selectedDistrict, selectedCrop);
        setData(newData);
        setAnimationStep(0); // Reset animation
        setFocusedTrip(null);
    }, [selectedState, selectedDistrict, selectedCrop]);

    // 2. Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationStep(prev => (prev + 1) % 100);
        }, 100); // Update every 100ms
        return () => clearInterval(interval);
    }, []);

    // 3. Update Truck Positions
    useEffect(() => {
        const newPositions = {};
        data.activeTrips.forEach(trip => {
            const idx = animationStep; // Simple 0-100 progress
            // In a real app, we'd interpolate between route points. 
            // Here route has 101 points (0 to 100), so we just pick the index.
            if (trip.route[idx]) {
                newPositions[trip.tripId] = trip.route[idx];
            }
        });
        setTruckPositions(newPositions);
    }, [animationStep, data.activeTrips]);

    const handleTripClick = (trip) => {
        setFocusedTrip(trip);
        if (voiceMode && speak) {
            speak(`${t('tracking_truck') || "Tracking truck"} ${trip.truckNumber}. ${t('eta') || "ETA"}: ${trip.eta}`);
        }
    };

    return (
        <div className="flex flex-col h-[700px] gap-4 animate-in fade-in">
            {/* Header Controls */}
            <DashboardHeader 
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedCrop={selectedCrop}
                setSelectedCrop={setSelectedCrop}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
            />

            <div className="flex flex-col lg:flex-row gap-4 h-full">
                {/* Left: Stats & List */}
                <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-md p-4 overflow-y-auto border border-gray-200">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Truck className="text-green-600" /> {t('logistics_hub') || "Logistics Hub"}
                            </h2>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin size={14} /> {selectedDistrict}, {selectedState}
                            </p>
                        </div>
                        <button onClick={() => voiceMode && speak && speak(t('logistics_page_voice') || "Track your shipments and warehouse capacity here.")} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                            <Volume2 size={20} />
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                            <div className="text-xs text-green-600 font-bold uppercase">{t('active_trips') || "Active Trips"}</div>
                            <div className="text-2xl font-bold text-green-800">{data.activeTrips.length}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                            <div className="text-xs text-green-600 font-bold uppercase">{t('warehouses') || "Warehouses"}</div>
                            <div className="text-2xl font-bold text-green-800">{data.warehouses.length}</div>
                        </div>
                    </div>

                    {/* ANN Log Panel */}
                    <div className="mb-6 h-48">
                        <ANNLogPanel />
                    </div>

                    {/* Storage Capacity Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">{t('storage_capacity') || "Storage Capacity"}</h3>
                        <div className="space-y-3">
                            {data.warehouses.map(wh => (
                                <div key={wh.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                                        <span>{wh.name}</span>
                                        <span>{Math.round((wh.filled / wh.total) * 100)}% {t('full') || "Full"}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className={`h-2.5 rounded-full ${wh.filled/wh.total > 0.8 ? 'bg-red-500' : 'bg-blue-600'}`} 
                                            style={{ width: `${(wh.filled / wh.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{wh.filled} {t('mt_used') || "MT Used"}</span>
                                        <span>{wh.total} {t('mt_total') || "MT Total"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Trips List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('gps_tracking_system') || "GPS Tracking System"}</h3>
                        {data.activeTrips.map(trip => (
                            <div 
                                key={trip.tripId} 
                                onClick={() => handleTripClick(trip)}
                                className={`bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer ${focusedTrip?.tripId === trip.tripId ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-bold text-gray-800 text-sm block">{trip.truckNumber}</span>
                                        <span className="text-[10px] text-gray-500 font-medium">{trip.provider}</span>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                        <Navigation size={10} /> {t('gps_active') || "GPS Active"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <Package size={12} /> {trip.cargo} ({trip.weight} {t('tons') || "Tons"})
                                </div>
                                
                                {/* ANN Predictions */}
                                <div className="bg-purple-50 p-2 rounded mb-2 border border-purple-100">
                                    <div className="flex items-center gap-1 text-[10px] text-purple-700 font-bold mb-1">
                                        <Brain size={10} /> {t('ann_prediction') || "ANN Prediction"}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-700">
                                        <span>{t('cost') || "Cost"}: ₹{trip.ann_cost}</span>
                                        <span>{t('eta') || "ETA"}: {trip.ann_eta} {t('hrs') || "hrs"}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-xs font-bold text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                                    <span>{t('speed') || "Speed"}: {trip.speed}</span>
                                    <span>{t('dist') || "Dist"}: {trip.distance} km</span>
                                </div>
                                <div className="relative pt-2">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>{t('depot') || "Depot"}</span>
                                        <span className="text-green-600 font-bold">{t('shortest_route') || "Shortest Route"}</span>
                                        <span>{t('market') || "Market"}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                                            style={{ width: `${animationStep}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.activeTrips.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                {t('no_active_shipments') || "No active shipments in this district."}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Map */}
                <div className="w-full lg:w-2/3 bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 relative">
                    <MapContainer 
                        key={`${selectedState}-${selectedDistrict}`}
                        center={[data.center.lat, data.center.lng]} 
                        zoom={11} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        
                        <MapUpdater center={data.center} zoom={11} />

                        {/* Warehouses */}
                        {data.warehouses.map(wh => (
                            <Marker key={wh.id} position={[wh.lat, wh.lng]} icon={warehouseIcon}>
                                <Popup>
                                    <div className="p-2 min-w-[150px]">
                                        <h3 className="font-bold text-sm mb-1">{wh.name}</h3>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                            <div 
                                                className={`h-2 rounded-full ${wh.filled/wh.total > 0.8 ? 'bg-red-500' : 'bg-blue-600'}`} 
                                                style={{ width: `${(wh.filled / wh.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-600 font-bold">{wh.filled} / {wh.total} MT</p>
                                        <p className="text-xs text-gray-500">{wh.type}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Trucks & Routes */}
                        {data.activeTrips.map(trip => (
                            <React.Fragment key={trip.tripId}>
                                {/* Route Line - Green for Shortest Route */}
                                <Polyline 
                                    positions={trip.route} 
                                    color={focusedTrip?.tripId === trip.tripId ? "#16a34a" : "#3b82f6"} 
                                    weight={focusedTrip?.tripId === trip.tripId ? 5 : 3} 
                                    opacity={0.8} 
                                />
                                
                                {/* Moving Truck */}
                                {truckPositions[trip.tripId] && (
                                    <Marker 
                                        position={truckPositions[trip.tripId]} 
                                        icon={truckIcon}
                                        zIndexOffset={1000}
                                    >
                                        <Popup>
                                            <div className="p-2">
                                                <h3 className="font-bold text-sm">{trip.truckNumber}</h3>
                                                <div className="flex items-center gap-1 text-green-600 text-xs font-bold mb-1">
                                                    <Navigation size={12} /> {t('gps_tracking_active') || "GPS Tracking Active"}
                                                </div>
                                                <p className="text-xs text-gray-600">{t('speed') || "Speed"}: {trip.speed}</p>
                                                <p className="text-xs text-gray-600">{t('distance') || "Distance"}: {trip.distance} {t('remaining') || "remaining"}</p>
                                                <p className="text-xs text-gray-600">{t('driver') || "Driver"}: {trip.driver}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}

                                {/* Destination Marker */}
                                <Marker position={[trip.end.lat, trip.end.lng]} icon={destinationIcon}>
                                    <Popup>{t('destination') || "Destination"}</Popup>
                                </Marker>
                            </React.Fragment>
                        ))}
                    </MapContainer>

                    {/* Map Overlay Legend */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-[1000] text-xs">
                        <div className="font-bold mb-2 text-gray-700">{t('logistics_network') || "Logistics Network"}</div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/4481/4481127.png" className="w-4 h-4" alt="WH" />
                                <span>{t('warehouse_capacity') || "Warehouse (Capacity)"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/2554/2554978.png" className="w-4 h-4" alt="Truck" />
                                <span>{t('gps_tracked_truck') || "GPS Tracked Truck"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-0.5 bg-green-500"></div>
                                <span>{t('ann_optimized_route') || "ANN Optimized Route"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsDashboard;