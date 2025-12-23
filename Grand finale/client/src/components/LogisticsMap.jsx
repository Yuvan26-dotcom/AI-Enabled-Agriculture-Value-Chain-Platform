import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, Bug } from 'lucide-react';
import axios from 'axios';
import RequestPickupModal from './RequestPickupModal';

// Custom Icons using standard Leaflet color markers
const warehouseIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const processorIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const farmIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const LogisticsMap = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [pestReports, setPestReports] = useState([]);

    // Center on India
    const center = [20.5937, 78.9629];

    // Fetch Pest Reports
    useEffect(() => {
        const fetchPestReports = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/pest-reports');
                setPestReports(res.data);
            } catch (error) {
                console.error("Error fetching pest reports", error);
            }
        };
        if (showHeatmap) {
            fetchPestReports();
        }
    }, [showHeatmap]);

    // Mock Data - Expanded for All Regions
    const warehouses = [
        { id: 1, pos: [22.7196, 75.8577], name: "Indore Warehouse", capacity: "80%" },
        { id: 2, pos: [23.2599, 77.4126], name: "Bhopal Storage", capacity: "45%" },
        { id: 3, pos: [23.1793, 75.7849], name: "Ujjain Depot", capacity: "90%" },
        { id: 4, pos: [28.7041, 77.1025], name: "Delhi NCR Hub", capacity: "85%" },
        { id: 5, pos: [19.0760, 72.8777], name: "Mumbai Port Storage", capacity: "92%" },
        { id: 6, pos: [13.0827, 80.2707], name: "Chennai Logistics", capacity: "60%" },
        { id: 7, pos: [22.5726, 88.3639], name: "Kolkata Distribution", capacity: "70%" },
        { id: 8, pos: [12.9716, 77.5946], name: "Bangalore Hub", capacity: "50%" },
        { id: 9, pos: [26.9124, 75.7873], name: "Jaipur Central", capacity: "40%" },
        { id: 10, pos: [17.3850, 78.4867], name: "Hyderabad Depot", capacity: "75%" },
        { id: 11, pos: [21.1458, 79.0882], name: "Nagpur Central", capacity: "65%" },
        { id: 12, pos: [26.8467, 80.9462], name: "Lucknow Storage", capacity: "55%" },
        { id: 13, pos: [23.0225, 72.5714], name: "Ahmedabad Hub", capacity: "88%" },
        { id: 14, pos: [25.5941, 85.1376], name: "Patna Warehouse", capacity: "62%" },
        { id: 15, pos: [26.1445, 91.7362], name: "Guwahati Regional", capacity: "48%" }
    ];

    const processors = [
        { id: 1, pos: [22.9676, 76.0534], name: "Dewas Oil Mills" },
        { id: 2, pos: [23.8388, 79.4308], name: "Sagar Processing Unit" },
        { id: 3, pos: [18.5204, 73.8567], name: "Pune Agro Tech" },
        { id: 4, pos: [30.9010, 75.8573], name: "Ludhiana Oils" },
        { id: 5, pos: [21.2514, 81.6296], name: "Raipur Processing" },
        { id: 6, pos: [11.0168, 76.9558], name: "Coimbatore Extracts" },
        { id: 7, pos: [20.2961, 85.8245], name: "Bhubaneswar Refineries" },
        { id: 8, pos: [24.5854, 73.7125], name: "Udaipur Soya Plant" }
    ];

    // Simulation: Farm Cluster connecting to nearest warehouse (Indore)
    const farmCluster = [22.5, 76.5]; 
    const nearestWarehouse = warehouses[0].pos; 
    const route = [farmCluster, nearestWarehouse];

    return (
        <div className="relative">
            <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md border border-gray-200 relative z-0">
                <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {/* Warehouses */}
                    {warehouses.map(wh => (
                        <Marker key={`wh-${wh.id}`} position={wh.pos} icon={warehouseIcon}>
                            <Popup>
                                <div className="font-sans">
                                    <h3 className="font-bold text-green-600 text-sm">{wh.name}</h3>
                                    <p className="text-xs mt-1">
                                        Capacity: <span className={parseInt(wh.capacity) > 75 ? "text-red-500 font-bold" : "text-green-600"}>{wh.capacity} Full</span>
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Processors */}
                    {processors.map(proc => (
                        <Marker key={`proc-${proc.id}`} position={proc.pos} icon={processorIcon}>
                            <Popup>
                                <div className="font-sans">
                                    <h3 className="font-bold text-orange-600 text-sm">{proc.name}</h3>
                                    <p className="text-xs mt-1">Processing Unit</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Farm Cluster */}
                    <Marker position={farmCluster} icon={farmIcon}>
                        <Popup>
                            <div className="font-sans">
                                <h3 className="font-bold text-green-600 text-sm">Farm Cluster</h3>
                                <p className="text-xs mt-1">Harvest Ready</p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Route */}
                    <Polyline positions={route} color="green" dashArray="10, 10" weight={3}>
                        <Popup>Optimized Route to Nearest Warehouse</Popup>
                    </Polyline>

                    {/* Pest Heatmap (Red Cloud) */}
                    {showHeatmap && pestReports.map((report, index) => (
                        <Circle 
                            key={index}
                            center={[report.location.coordinates[1], report.location.coordinates[0]]}
                            pathOptions={{ fillColor: 'red', color: 'red', opacity: 0.1, fillOpacity: 0.4 }}
                            radius={5000} // 5km radius
                        >
                            <Popup>
                                <div className="text-xs">
                                    <strong>Pest Reported!</strong><br/>
                                    Type: {report.pestType}<br/>
                                    Severity: {report.severity}
                                </div>
                            </Popup>
                        </Circle>
                    ))}

                </MapContainer>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2 items-end">
                <button 
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`${showHeatmap ? 'bg-red-600 hover:bg-red-700' : 'bg-white text-red-600 hover:bg-gray-100'} border border-red-200 font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-all`}
                >
                    <Bug size={20} /> {showHeatmap ? 'Hide Infection Spread' : 'Show Infection Spread'}
                </button>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <Truck size={20} /> Request Pickup
                </button>
            </div>

            <RequestPickupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default LogisticsMap;