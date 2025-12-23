import React, { useState } from 'react';
import { Users, Package, CheckSquare, FileText, PenTool, QrCode } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const FPOStage = ({ onNavigate }) => {
  const { activeBatch, updateStage, addLog } = useTraceability();
  const [lotId] = useState('FPO-LOT-2024-X99');
  const [step, setStep] = useState('dashboard'); // dashboard, grading, complete

  const handleCreateLot = () => {
    if (!activeBatch.farmData) {
      alert("No harvest data found! Please complete Farm Stage first.");
      return;
    }
    setStep('grading');
  };

  const handleFinalize = () => {
    const fpoData = {
      lotId,
      totalWeight: '150 Qtl', // Simulated aggregation
      grade: 'A',
      farmers: [activeBatch.farmData.harvestId, 'HARVEST-MOCK-002', 'HARVEST-MOCK-003'],
      aggregator: 'Samarth Kisan FPO'
    };
    updateStage('fpoData', fpoData);
    addLog('FPO', 'Aggregation Complete', `Created Lot ${lotId} with Grade A`, null);
    setStep('complete');
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden min-h-[600px]">
      <div className="bg-blue-700 p-6 text-white flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Users size={28} /> FPO Aggregation Center
        </h2>
        <div className="text-sm bg-blue-800 px-3 py-1 rounded-full">
          Samarth Kisan FPO (ID: FPO-IND-05)
        </div>
      </div>

      <div className="p-8">
        {step === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-blue-800 font-bold mb-2">Pending Harvests</h3>
                <p className="text-4xl font-bold text-blue-600">3</p>
                <p className="text-sm text-blue-400 mt-2">Ready for aggregation</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h3 className="text-green-800 font-bold mb-2">Total Quantity</h3>
                <p className="text-4xl font-bold text-green-600">150 Qtl</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h3 className="text-purple-800 font-bold mb-2">Active Lots</h3>
                <p className="text-4xl font-bold text-purple-600">12</p>
              </div>
            </div>

            {/* Incoming List */}
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-bold text-gray-600">Harvest ID</th>
                    <th className="p-4 font-bold text-gray-600">Farmer</th>
                    <th className="p-4 font-bold text-gray-600">Qty</th>
                    <th className="p-4 font-bold text-gray-600">Moisture</th>
                    <th className="p-4 font-bold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activeBatch.farmData ? (
                    <tr className="bg-blue-50/50">
                      <td className="p-4 font-mono text-sm">{activeBatch.farmData.harvestId}</td>
                      <td className="p-4">Rajesh Kumar</td>
                      <td className="p-4">{activeBatch.farmData.quantity}</td>
                      <td className="p-4">{activeBatch.farmData.moisture}</td>
                      <td className="p-4"><span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">Verified</span></td>
                    </tr>
                  ) : (
                    <tr><td colSpan="5" className="p-4 text-center text-gray-400">No active harvest from demo</td></tr>
                  )}
                  <tr>
                    <td className="p-4 font-mono text-sm">HARVEST-MOCK-002</td>
                    <td className="p-4">Suresh Patel</td>
                    <td className="p-4">50 Qtl</td>
                    <td className="p-4">11.5%</td>
                    <td className="p-4"><span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">Verified</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">HARVEST-MOCK-003</td>
                    <td className="p-4">Mahesh Singh</td>
                    <td className="p-4">50 Qtl</td>
                    <td className="p-4">12.2%</td>
                    <td className="p-4"><span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">Verified</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleCreateLot}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2"
              >
                <Package size={20} /> Create Aggregated Lot
              </button>
            </div>
          </div>
        )}

        {step === 'grading' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Quality Grading & Certification</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Moisture Content (Avg)</label>
                <input type="text" value="11.9%" readOnly className="w-full p-3 bg-gray-50 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Oil Content (Est)</label>
                <input type="text" value="18.5%" readOnly className="w-full p-3 bg-gray-50 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Foreign Matter</label>
                <input type="text" value="1.2%" readOnly className="w-full p-3 bg-gray-50 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Assigned Grade</label>
                <select className="w-full p-3 border border-blue-300 rounded-lg font-bold text-blue-800">
                  <option>Grade A (Premium)</option>
                  <option>Grade B (Standard)</option>
                  <option>Grade C (Fair)</option>
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center">
              <FileText className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Upload Lab Report (PDF/Image)</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start gap-3">
              <PenTool className="text-yellow-700 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-yellow-800 text-sm">Digital Signature Required</h4>
                <p className="text-xs text-yellow-700">By signing, you certify that these 3 harvests have been physically verified and aggregated.</p>
              </div>
            </div>

            <button 
              onClick={handleFinalize}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 shadow-lg"
            >
              Sign & Generate Lot QR
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-12 animate-in zoom-in">
            <div className="bg-white p-6 rounded-2xl shadow-xl inline-block mb-6 border border-gray-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${lotId}`} 
                alt="Lot QR" 
                className="w-48 h-48"
              />
              <p className="font-mono font-bold mt-2 text-gray-600">{lotId}</p>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aggregation Complete</h3>
            <p className="text-gray-500 mb-8">Lot is ready for transport to Warehouse/Processor</p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => onNavigate('warehouse')}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 shadow-lg"
              >
                Move to Logistics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FPOStage;
