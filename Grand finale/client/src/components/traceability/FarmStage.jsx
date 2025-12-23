import React, { useState, useEffect } from 'react';
import { Tractor, QrCode, MapPin, Calendar, Droplets, Sprout, Camera, Mic, CheckCircle } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const FarmStage = ({ onNavigate }) => {
  const { activeBatch, updateStage, addLog } = useTraceability();
  const [step, setStep] = useState('scan'); // scan, activity, harvest
  const [scannedSeed, setScannedSeed] = useState(null);
  const [harvestData, setHarvestData] = useState({
    harvestId: 'HARVEST-2024-001',
    quantity: '50 Qtl',
    moisture: '12%',
    harvestDate: new Date().toISOString().split('T')[0]
  });

  // Simulate Scanning Seed QR
  const handleScanSeed = () => {
    if (activeBatch.seedData) {
      setScannedSeed(activeBatch.seedData);
      setStep('activity');
      addLog('Farmer', 'Seed Scanned', `Farmer scanned Seed Batch ${activeBatch.seedData.batchId}`, null);
    } else {
      alert("No seed batch found! Please go to Seed Stage first.");
    }
  };

  const handleHarvestSubmit = (e) => {
    e.preventDefault();
    updateStage('farmData', { ...harvestData, seedBatchId: scannedSeed.batchId });
    addLog('Farmer', 'Harvest Recorded', `Harvested ${harvestData.quantity} of ${scannedSeed.variety}`, null);
    setStep('complete');
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-[600px] shadow-2xl rounded-xl overflow-hidden border border-gray-200 relative">
      {/* Mobile Header */}
      <div className="bg-green-600 p-4 text-white flex justify-between items-center">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Tractor size={20} /> Farmer App
        </h2>
        <div className="flex gap-2">
          <button onClick={() => speak("Scan the seed packet QR code to begin.")} className="bg-white/20 p-2 rounded-full">
            <Mic size={18} />
          </button>
          <div className="bg-green-800 px-2 py-1 rounded text-xs">Online</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {step === 'scan' && (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="w-64 h-64 bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 border-2 border-green-500 animate-pulse"></div>
              <QrCode size={64} className="text-white opacity-50" />
              <button 
                onClick={handleScanSeed}
                className="absolute bottom-4 bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-600"
              >
                Simulate Scan
              </button>
            </div>
            <p className="text-gray-500 text-center">Point camera at Seed Packet QR Code</p>
          </div>
        )}

        {step === 'activity' && scannedSeed && (
          <div className="space-y-4 animate-in slide-in-from-right">
            {/* Seed Info Card */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-green-800">{scannedSeed.variety}</h3>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Verified</span>
              </div>
              <p className="text-xs text-green-600">Batch: {scannedSeed.batchId}</p>
            </div>

            {/* Farm Map Placeholder */}
            <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center relative overflow-hidden">
              <img src="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/75.8577,22.7196,15,0/400x200?access_token=pk.mock" alt="Farm Map" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="relative z-10 bg-white/80 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <MapPin size={12} /> 22.7196° N, 75.8577° E
              </div>
            </div>

            {/* Activity Log */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Calendar className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm font-bold">Sowing Date</p>
                  <p className="text-xs text-gray-500">15 June 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Droplets className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm font-bold">Irrigation</p>
                  <p className="text-xs text-gray-500">Drip System (Active)</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep('harvest')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-lg mt-4"
            >
              Record Harvest
            </button>
          </div>
        )}

        {step === 'harvest' && (
          <form onSubmit={handleHarvestSubmit} className="space-y-4 animate-in slide-in-from-right">
            <h3 className="font-bold text-lg text-gray-800">Harvest Declaration</h3>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Quantity (Quintals)</label>
              <input 
                type="number" 
                value={harvestData.quantity.replace(' Qtl', '')}
                onChange={(e) => setHarvestData({...harvestData, quantity: e.target.value + ' Qtl'})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Moisture Content</label>
              <input 
                type="text" 
                value={harvestData.moisture}
                onChange={(e) => setHarvestData({...harvestData, moisture: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Camera className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">Upload Harvest Photo (Proof of Practice)</p>
            </div>

            <button 
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-lg"
            >
              Generate Harvest QR
            </button>
          </form>
        )}

        {step === 'complete' && (
          <div className="text-center py-8 animate-in zoom-in">
            <div className="bg-white p-4 rounded-xl shadow-md inline-block mb-4 border border-gray-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${harvestData.harvestId}`} 
                alt="Harvest QR" 
                className="w-40 h-40"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Harvest Recorded!</h3>
            <p className="text-sm text-gray-500 mb-6">Ready for FPO Aggregation</p>
            
            <button 
              onClick={() => onNavigate('fpo')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg"
            >
              Go to FPO Stage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmStage;
