import React, { useState } from 'react';
import { Factory, QrCode, FlaskConical, CheckCircle, FileText, Settings } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const ProcessorStage = ({ onNavigate }) => {
  const { activeBatch, updateStage, addLog } = useTraceability();
  const [step, setStep] = useState('procure'); // procure, process, complete
  const [oilBatchId] = useState('OIL-BATCH-2024-FINAL-001');

  const handleProcure = () => {
    if (!activeBatch.warehouseData) {
      alert("No shipment found! Please complete Warehouse Stage first.");
      return;
    }
    addLog('Processor', 'Procurement', `Received Lot ${activeBatch.fpoData.lotId} from Truck ${activeBatch.warehouseData.truckId}`, null);
    setStep('process');
  };

  const handleProcessComplete = () => {
    const processorData = {
      oilBatchId,
      processDate: new Date().toISOString(),
      method: 'Cold Pressed',
      temp: '42°C',
      recovery: '18.2%',
      quality: 'Premium Grade',
      labReport: 'LAB-REP-2024-882'
    };
    updateStage('processorData', processorData);
    addLog('Processor', 'Processing Complete', `Extracted Oil Batch ${oilBatchId}`, null);
    setStep('complete');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden min-h-[600px]">
      <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Factory size={28} /> Oil Processing Unit
        </h2>
        <div className="text-sm bg-orange-700 px-3 py-1 rounded-full">
          Mahakal Oil Mills (ID: PROC-MP-01)
        </div>
      </div>

      <div className="p-8">
        {step === 'procure' && (
          <div className="flex flex-col items-center justify-center h-96 space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-100 rounded-full animate-ping opacity-75"></div>
              <button 
                onClick={handleProcure}
                className="relative bg-orange-600 text-white w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition-transform"
              >
                <QrCode size={48} className="mb-2" />
                <span className="font-bold text-lg">Scan Truck QR</span>
              </button>
            </div>
            <p className="text-gray-500 font-medium">Waiting for shipment arrival...</p>
          </div>
        )}

        {step === 'process' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">Processing Dashboard</h3>
              <span className="text-orange-600 font-mono font-bold">{activeBatch.fpoData?.lotId}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Process Parameters */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-600 flex items-center gap-2">
                  <Settings size={18} /> Extraction Parameters
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-bold">Cold Pressed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Temperature</span>
                    <span className="font-bold text-green-600">42°C (Optimal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pressure</span>
                    <span className="font-bold">120 Bar</span>
                  </div>
                </div>
              </div>

              {/* Right: Lab Results */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-600 flex items-center gap-2">
                  <FlaskConical size={18} /> Quality Control
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Oil Recovery</span>
                    <span className="font-bold text-blue-700">18.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Free Fatty Acid</span>
                    <span className="font-bold text-blue-700">0.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purity</span>
                    <span className="font-bold text-blue-700">99.9%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Visualization */}
            <div className="py-6">
              <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                <span>Cleaning</span>
                <span>Crushing</span>
                <span>Filtration</span>
                <span>Bottling</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-3/4 animate-pulse"></div>
              </div>
            </div>

            <button 
              onClick={handleProcessComplete}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle /> Complete Processing & Generate Batch QR
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-12 animate-in zoom-in">
            <div className="bg-white p-6 rounded-2xl shadow-xl inline-block mb-6 border border-gray-200 relative">
              <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                <CheckCircle size={24} />
              </div>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${oilBatchId}`} 
                alt="Final Product QR" 
                className="w-48 h-48"
              />
              <p className="font-mono font-bold mt-2 text-gray-600">{oilBatchId}</p>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready for Retail</h3>
            <p className="text-gray-500 mb-8">
              This QR code contains the entire history of {activeBatch.fpoData?.farmers?.length || 3} farmers.
            </p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => onNavigate('retailer')}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 shadow-lg"
              >
                Ship to Retailer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessorStage;
