import React, { useState, useEffect } from 'react';
import { Warehouse, Truck, MapPin, Thermometer, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const WarehouseStage = ({ onNavigate }) => {
  const { activeBatch, updateStage, addLog } = useTraceability();
  const [step, setStep] = useState('entry'); // entry, storage, transport
  const [truckId] = useState('MP-09-GA-1234');
  const [temp, setTemp] = useState(24);

  // Simulate Temperature Fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(prev => prev + (Math.random() > 0.5 ? 0.5 : -0.5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInwardEntry = () => {
    if (!activeBatch.fpoData) {
      alert("No FPO Lot found! Please complete FPO Stage first.");
      return;
    }
    addLog('Warehouse', 'Inward Entry', `Lot ${activeBatch.fpoData.lotId} stored at Warehouse W-101`, null);
    setStep('storage');
  };

  const handleDispatch = () => {
    const warehouseData = {
      warehouseId: 'W-101',
      location: 'Dewas Logistics Hub',
      entryDate: new Date().toISOString(),
      dispatchDate: new Date().toISOString(),
      truckId,
      driver: 'Ramesh Yadav'
    };
    updateStage('warehouseData', warehouseData);
    addLog('Logistics', 'Dispatch', `Dispatched via Truck ${truckId} to Processor`, null);
    setStep('transport');
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar / Status */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-600">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Warehouse className="text-purple-600" /> Warehouse W-101
          </h2>
          <p className="text-sm text-gray-500 mb-4">Dewas Logistics Hub</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Capacity</span>
              <span className="font-bold text-purple-700">85% Full</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Thermometer size={16} /> Temp
              </span>
              <span className="font-bold text-blue-700">{temp.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Humidity</span>
              <span className="font-bold text-green-700">45%</span>
            </div>
          </div>
        </div>

        {step === 'transport' && (
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 animate-in slide-in-from-left">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-4">
              <Truck className="text-orange-500" /> Live Transport
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh" alt="Driver" className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-sm">Ramesh Yadav</p>
                  <p className="text-xs text-gray-500">Driver • 4.8 ★</p>
                </div>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-2/3 animate-pulse"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Dewas</span>
                <span>ETA: 2 Hrs</span>
                <span>Indore</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Action Area */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden min-h-[500px]">
        {step === 'entry' && (
          <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Warehouse size={40} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Inward Entry Scan</h3>
            <p className="text-gray-500 max-w-md">Scan the FPO Lot QR code to record entry into the warehouse ledger.</p>
            
            <button 
              onClick={handleInwardEntry}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <QrCode /> Scan Lot QR
            </button>
          </div>
        )}

        {step === 'storage' && (
          <div className="p-8 space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">Lot Details</h3>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">Stored</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Lot ID</label>
                <p className="font-mono text-lg">{activeBatch.fpoData?.lotId || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Weight</label>
                <p className="font-mono text-lg">{activeBatch.fpoData?.totalWeight || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Grade</label>
                <p className="font-mono text-lg">{activeBatch.fpoData?.grade || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Entry Time</label>
                <p className="font-mono text-lg">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex gap-3">
              <AlertTriangle className="text-yellow-600 shrink-0" />
              <div>
                <h4 className="font-bold text-yellow-800 text-sm">AI Route Suggestion</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Traffic detected on NH-52. Suggested alternate route via Ujjain Bypass saves 45 mins.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={handleDispatch}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold hover:bg-orange-700 shadow-lg flex items-center justify-center gap-2"
              >
                <Truck /> Dispatch to Processor
              </button>
            </div>
          </div>
        )}

        {step === 'transport' && (
          <div className="relative h-full w-full bg-gray-100">
            {/* Mock Map */}
            <img 
              src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/76.0534,22.9676,10,0/800x600?access_token=pk.mock" 
              alt="Route Map" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl text-center max-w-sm">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Shipment In Transit</h3>
                <p className="text-gray-600 mb-6">Live GPS tracking active. Blockchain updated every 10 mins.</p>
                <button 
                  onClick={() => onNavigate('processor')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 w-full"
                >
                  Arrive at Processor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseStage;
