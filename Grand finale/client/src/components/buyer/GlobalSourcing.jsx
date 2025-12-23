import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Filter, MapPin, Phone, Star, Truck } from 'lucide-react';
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

const GlobalSourcing = () => {
  const [selectedCrop, setSelectedCrop] = useState('Soybean');
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchFarmers();
  }, [selectedCrop]);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      // Fetch Produce Listings instead of just farmers
      const res = await api.get(`/produce?crop=${selectedCrop}`);
      
      if (res.data.length === 0) {
        // Mock Data if API is empty
        setFarmers([
          { id: 1, name: 'Rajesh Kumar', location: 'Indore, MP', crop: 'Soybean', quantity: '50 Qtl', rating: 4.8, coords: [22.7196, 75.8577] },
          { id: 2, name: 'Suresh Patel', location: 'Ujjain, MP', crop: 'Soybean', quantity: '120 Qtl', rating: 4.5, coords: [23.1765, 75.7819] },
          { id: 3, name: 'Amit Singh', location: 'Dewas, MP', crop: 'Soybean', quantity: '80 Qtl', rating: 4.9, coords: [22.9676, 76.0534] },
          { id: 4, name: 'Vikram Choudhary', location: 'Sehore, MP', crop: 'Soybean', quantity: '200 Qtl', rating: 4.7, coords: [23.2030, 77.0844] },
          { id: 5, name: 'Ramesh Yadav', location: 'Bhopal, MP', crop: 'Soybean', quantity: '45 Qtl', rating: 4.2, coords: [23.2599, 77.4126] },
          { id: 6, name: 'Kishan Lal', location: 'Vidisha, MP', crop: 'Soybean', quantity: '60 Qtl', rating: 4.3, coords: [23.5251, 77.8081] },
          { id: 7, name: 'Mohan Das', location: 'Hoshangabad, MP', crop: 'Soybean', quantity: '90 Qtl', rating: 4.6, coords: [22.7519, 77.7289] },
        ]);
      } else {
        // Map produce listings to the format expected by the UI
        const mappedData = res.data.map(item => ({
            id: item._id,
            name: item.farmerName || 'Farmer',
            location: item.location || 'Madhya Pradesh',
            crop: item.cropName,
            quantity: item.quantity + ' Qtl',
            rating: 4.5,
            coords: item.coords || [22.7196 + (Math.random() - 0.5), 75.8577 + (Math.random() - 0.5)]
        }));
        setFarmers(mappedData);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching farmers:', err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-150px)] gap-6 animate-in fade-in">
      
      {/* Left Panel: Search & List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="text-blue-600" /> Find Suppliers
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Crop</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option>Soybean</option>
                <option>Mustard</option>
                <option>Groundnut</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Min Quantity (Qtl)</label>
              <input type="number" placeholder="e.g. 50" className="w-full p-2 border border-gray-300 rounded-lg mt-1" />
            </div>
            <button 
              onClick={fetchFarmers}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
            >
              Search Market
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700">{farmers.length} Farmers Found</h3>
          </div>
          <div className="overflow-y-auto p-2 space-y-2 flex-1">
            {loading ? (
              <div className="text-center p-4 text-gray-500">Searching...</div>
            ) : (
              farmers.map(farmer => (
                <div key={farmer.id} className="p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800">{farmer.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={12} /> {farmer.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-yellow-700">
                      <Star size={12} fill="currentColor" /> {farmer.rating || 4.5}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {farmer.quantity || 'N/A'} Available
                    </span>
                    <button className="text-xs bg-gray-900 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Contact
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="w-full lg:w-2/3 bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 relative">
        <MapContainer center={[22.9, 76.5]} zoom={8} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {!loading && farmers.map(farmer => (
            <Marker key={farmer.id} position={farmer.coords || [22.7, 75.8]}>
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-blue-800">{farmer.name}</h4>
                  <p className="text-xs font-bold">{farmer.crop || selectedCrop} • {farmer.quantity || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{farmer.location}</p>
                  <button className="mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded">
                    Request Quote
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-lg z-[1000]">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>
            Verified Farmer
          </div>
        </div>
      </div>

    </div>
  );
};

export default GlobalSourcing;
