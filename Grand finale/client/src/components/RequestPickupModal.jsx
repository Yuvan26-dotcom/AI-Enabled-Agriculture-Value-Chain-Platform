import React, { useState } from 'react';
import axios from 'axios';
import { Truck, Calendar, Package, Search, CheckCircle, QrCode, X, MapPin, Clock } from 'lucide-react';

const RequestPickupModal = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState('input'); // input, scanning, matched, ticket
  const [formData, setFormData] = useState({
    crop: 'Soybean',
    quantity: '',
    pickupDate: ''
  });
  const [passDetails, setPassDetails] = useState(null);

  if (!isOpen) return null; 

  const handleFindTruck = () => {
    if (!formData.quantity || !formData.pickupDate) {
      alert("Please fill in all fields");
      return;
    }
    setStage('scanning');
    setTimeout(() => {
      setStage('matched');
    }, 2000);
  };

  const handleConfirm = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/logistics/request', formData);
      setPassDetails(res.data);
      setStage('ticket');
    } catch (error) {
      console.error("Error requesting pickup", error);
      alert("Failed to confirm pickup. Please try again.");
    }
  };

  const resetAndClose = () => {
    setStage('input');
    setFormData({ crop: 'Soybean', quantity: '', pickupDate: '' });
    setPassDetails(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* STAGE 1: INPUT FORM */}
        {stage === 'input' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Request Pickup</h2>
                <p className="text-sm text-gray-500">Find a truck for your harvest</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Crop</label>
                <select 
                  value={formData.crop}
                  onChange={(e) => setFormData({...formData, crop: e.target.value})}
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Soybean">Soybean</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Sunflower">Sunflower</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Quintals)</label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                    className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleFindTruck}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition-colors flex items-center justify-center gap-2"
              >
                <Search size={20} /> Find Truck
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: SCANNING */}
        {stage === 'scanning' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <Truck className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">AI Aggregation in Progress</h3>
            <p className="text-gray-500">Scanning for nearby FPO trucks in Cluster #4...</p>
          </div>
        )}

        {/* STAGE 3: MATCH FOUND */}
        {stage === 'matched' && (
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h3 className="font-bold text-green-800">Match Found!</h3>
                <p className="text-xs text-green-600">Optimal route calculated via Anjar</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                FPO VERIFIED
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">🚛</div>
                <div>
                  <h4 className="font-bold text-gray-800">TRUCK-GJ-12-AB-9988</h4>
                  <p className="text-sm text-gray-500">Driver: Vikram Singh</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-blue-600 mt-1" />
                  <div>
                    <span className="block font-semibold text-gray-700">Route</span>
                    <span className="text-gray-600">Anjar ➝ Bhachau (Your Village) ➝ Warehouse</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-blue-600" />
                  <div>
                    <span className="font-semibold text-gray-700">Est. Pickup: </span>
                    <span className="text-gray-600">Tomorrow, 10:30 AM</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Confirm & Generate e-Gate Pass
            </button>
          </div>
        )}

        {/* STAGE 4: TICKET (e-Gate Pass) */}
        {stage === 'ticket' && passDetails && (
          <div className="p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">e-Gate Pass Generated</h2>
            <p className="text-gray-500 mb-6">Show this to the driver upon arrival</p>

            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6 relative">
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-800 rounded-full"></div>
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-800 rounded-full"></div>
              
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">PASS ID</p>
              <p className="text-2xl font-mono font-bold text-gray-800 mb-6">{passDetails.passId}</p>
              
              <div className="flex justify-center mb-4">
                {/* Placeholder QR Code */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${passDetails.passId}`} 
                  alt="QR Code" 
                  className="w-32 h-32"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Truck:</strong> {passDetails.truckDetails.number}</p>
                <p><strong>Driver:</strong> {passDetails.truckDetails.driver}</p>
              </div>
            </div>

            <button 
              onClick={resetAndClose}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPickupModal;
