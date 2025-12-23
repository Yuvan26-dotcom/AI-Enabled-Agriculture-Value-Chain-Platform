import React, { useState } from 'react';
import { ShoppingBag, QrCode, CheckCircle, MapPin, Calendar, ShieldCheck } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const RetailerStage = ({ onNavigate }) => {
  const { activeBatch, updateStage, addLog } = useTraceability();
  const [step, setStep] = useState('scan'); // scan, verify, shelf
  const [retailQr] = useState('RETAIL-SKU-2024-998877');

  const handleScan = () => {
    if (!activeBatch.processorData) {
      alert("No processed oil batch found! Please complete Processor Stage first.");
      return;
    }
    addLog('Retailer', 'Stock Received', `Received Oil Batch ${activeBatch.processorData.oilBatchId}`, null);
    setStep('verify');
  };

  const handleStockShelf = () => {
    const retailerData = {
      retailerName: 'FreshMart Supermarket',
      location: 'Bhopal, MP',
      stockDate: new Date().toISOString(),
      shelfLife: '6 Months',
      price: '₹185/L'
    };
    updateStage('retailerData', retailerData);
    addLog('Retailer', 'Shelf Stocking', `Product placed on shelf at FreshMart`, null);
    setStep('shelf');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden min-h-[600px]">
      <div className="bg-red-600 p-6 text-white flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ShoppingBag size={28} /> Retailer Portal
        </h2>
        <div className="text-sm bg-red-700 px-3 py-1 rounded-full">
          FreshMart Supermarket (ID: RET-BPL-05)
        </div>
      </div>

      <div className="p-8">
        {step === 'scan' && (
          <div className="flex flex-col items-center justify-center h-96 space-y-8">
            <div className="w-64 h-64 bg-gray-900 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 border-4 border-red-500 animate-pulse rounded-3xl"></div>
              <QrCode size={80} className="text-white opacity-50" />
              <button 
                onClick={handleScan}
                className="absolute bottom-6 bg-red-600 text-white px-8 py-2 rounded-full font-bold shadow-lg hover:bg-red-700 transition-transform hover:scale-105"
              >
                Scan Incoming Batch
              </button>
            </div>
            <p className="text-gray-500 font-medium">Scan the QR code on the incoming oil cartons.</p>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-8 animate-in slide-in-from-right">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
              <CheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-green-800">Authenticity Verified</h3>
                <p className="text-green-700">This batch is verified on the blockchain. Origin: Indore, MP.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <h4 className="text-gray-500 text-sm font-bold uppercase mb-3">Product Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batch ID</span>
                    <span className="font-mono font-bold">{activeBatch.processorData?.oilBatchId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Date</span>
                    <span className="font-bold">{new Date(activeBatch.processorData?.processDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry</span>
                    <span className="font-bold text-red-600">6 Months</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <h4 className="text-gray-500 text-sm font-bold uppercase mb-3">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> FSSAI
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> Organic (NPOP)
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> Agmark
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleStockShelf}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 shadow-lg"
            >
              Accept Stock & Generate Consumer QR
            </button>
          </div>
        )}

        {step === 'shelf' && (
          <div className="text-center py-12 animate-in zoom-in">
            <div className="bg-white p-6 rounded-2xl shadow-xl inline-block mb-6 border border-gray-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${retailQr}`} 
                alt="Consumer QR" 
                className="w-48 h-48"
              />
              <p className="font-mono font-bold mt-2 text-gray-600">SCAN ME</p>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">On The Shelf!</h3>
            <p className="text-gray-500 mb-8">
              Consumers can now scan this QR code to see the full journey.
            </p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => onNavigate('consumer')}
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-700 shadow-lg flex items-center gap-2"
              >
                <QrCode size={20} /> Simulate Consumer Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetailerStage;
