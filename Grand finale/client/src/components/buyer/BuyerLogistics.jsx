import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../api';

// Fix Leaflet Icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BuyerLogistics = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await api.get('/shipments');
      // If backend returns empty, use mock data for demo
      if (res.data.length === 0) {
        setShipments([
          { 
            id: 'TRK-2024-001', 
            driver: 'Ramesh Kumar', 
            origin: 'Indore, MP', 
            destination: 'Mumbai Port', 
            status: 'In Transit', 
            eta: '4 Hours', 
            cargo: 'Soybean (200 Qtl)',
            progress: 75,
            coords: [19.5, 73.5], // Near Mumbai
            path: [[22.7196, 75.8577], [19.0760, 72.8777]] // Indore to Mumbai
          },
          { 
            id: 'TRK-2024-002', 
            driver: 'Suresh Singh', 
            origin: 'Ujjain, MP', 
            destination: 'Nagpur Processing Unit', 
            status: 'Delayed', 
            eta: '12 Hours', 
            cargo: 'Mustard (150 Qtl)',
            progress: 40,
            coords: [22.0, 78.0],
            path: [[23.1765, 75.7819], [21.1458, 79.0882]] // Ujjain to Nagpur
          },
          { 
            id: 'TRK-2024-003', 
            driver: 'Vikram Singh', 
            origin: 'Jaipur, RJ', 
            destination: 'Delhi NCR Hub', 
            status: 'In Transit', 
            eta: '6 Hours', 
            cargo: 'Mustard (300 Qtl)',
            progress: 60,
            coords: [27.5, 76.5],
            path: [[26.9124, 75.7873], [28.7041, 77.1025]] // Jaipur to Delhi
          },
          { 
            id: 'TRK-2024-004', 
            driver: 'Amit Patel', 
            origin: 'Hyderabad, TS', 
            destination: 'Chennai Port', 
            status: 'Delivered', 
            eta: 'Arrived', 
            cargo: 'Groundnut (180 Qtl)',
            progress: 100,
            coords: [13.0827, 80.2707],
            path: [[17.3850, 78.4867], [13.0827, 80.2707]] // Hyderabad to Chennai
          },
          { 
            id: 'TRK-2024-005', 
            driver: 'Rahul Sharma', 
            origin: 'Lucknow, UP', 
            destination: 'Kolkata Distribution', 
            status: 'In Transit', 
            eta: '18 Hours', 
            cargo: 'Sesame (120 Qtl)',
            progress: 30,
            coords: [25.5, 85.0],
            path: [[26.8467, 80.9462], [22.5726, 88.3639]] // Lucknow to Kolkata
          }
        ]);
      } else {
        setShipments(res.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-150px)] gap-6 animate-in fade-in">
      
      {/* Left Panel: Shipment List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Truck className="text-blue-600" /> Active Shipments
          </h2>
          
          {loading ? (
            <div className="text-center p-4 text-gray-500">Loading logistics data...</div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[600px]">
              {shipments.map(shipment => (
                <div key={shipment.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-400">{shipment.id || shipment.trackingId}</span>
                      <h4 className="font-bold text-gray-800">{shipment.cargo.crop || shipment.cargo}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      shipment.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {shipment.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin size={14} /> {shipment.origin} <span className="text-gray-300">→</span> {shipment.destination}
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        shipment.status === 'Delayed' ? 'bg-red-500' : 'bg-blue-600'
                      }`} 
                      style={{ width: `${shipment.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Truck size={12}/> {shipment.driver.name || shipment.driver}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> ETA: {shipment.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="w-full lg:w-2/3 bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 relative">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {!loading && shipments.map(shipment => (
            <React.Fragment key={shipment.id || shipment.trackingId}>
              {shipment.coords && (
                <Marker position={shipment.coords || shipment.currentCoords}>
                  <Popup>
                    <div className="p-1">
                      <h4 className="font-bold text-blue-800">{shipment.id || shipment.trackingId}</h4>
                      <p className="text-xs font-bold">{shipment.status}</p>
                      <p className="text-xs text-gray-500">{shipment.cargo.crop || shipment.cargo}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
              {shipment.path && (
                <Polyline 
                  positions={shipment.path} 
                  color={shipment.status === 'Delayed' ? 'red' : 'blue'} 
                  dashArray="5, 10" 
                />
              )}
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

    </div>
  );
};

export default BuyerLogistics;
