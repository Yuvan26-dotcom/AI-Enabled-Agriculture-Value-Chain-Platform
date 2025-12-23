import React, { useState } from 'react';
import { Sprout, QrCode, CheckCircle, Mic, FileText } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const SeedStage = ({ onNavigate }) => {
  const { updateStage, addLog } = useTraceability();
  const [formData, setFormData] = useState({
    batchId: 'SEED-2024-BATCH-001',
    variety: 'JS-9560 (Soybean)',
    genetics: 'Non-GMO, High Yield',
    germinationRate: '98%',
    treatment: 'Thiram Treated',
    expiryDate: '2025-06-01'
  });
  const [generated, setGenerated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate Blockchain Transaction
    updateStage('seedData', formData);
    addLog('Seed Supplier', 'Batch Created', `Created Seed Batch ${formData.batchId}`, null);
    setGenerated(true);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sprout /> Seed Input Supplier
            </h2>
            <p className="opacity-90">Generate Certified Seed Batches</p>
          </div>
          <button onClick={() => speak("Enter seed details to generate a blockchain secured batch.")} className="bg-white/20 p-2 rounded-full hover:bg-white/30">
            <Mic size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch ID</label>
              <input 
                type="text" 
                value={formData.batchId}
                readOnly
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Seed Variety</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.variety}
                onChange={(e) => setFormData({...formData, variety: e.target.value})}
              >
                <option>JS-9560 (Soybean)</option>
                <option>JS-2034 (Soybean)</option>
                <option>Pusa Bold (Mustard)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Germination Rate</label>
                <input 
                  type="text" 
                  value={formData.germinationRate}
                  onChange={(e) => setFormData({...formData, germinationRate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Genetics</label>
                <input 
                  type="text" 
                  value={formData.genetics}
                  readOnly
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={generated}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all ${generated ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {generated ? 'Batch Generated' : 'Generate Blockchain Batch'}
            </button>
          </form>

          {/* Output Section */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
            {generated ? (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="bg-white p-4 rounded-xl shadow-md inline-block mb-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${formData.batchId}`} 
                    alt="Seed QR" 
                    className="w-40 h-40"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Batch #{formData.batchId}</h3>
                <p className="text-green-600 font-medium flex items-center justify-center gap-1">
                  <CheckCircle size={16} /> Blockchain Recorded
                </p>
                <div className="mt-6 space-y-2 w-full">
                  <button onClick={() => onNavigate('farm')} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Send to Farmer
                  </button>
                  <button className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2">
                    <FileText size={16} /> Print Label
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <QrCode size={64} className="mx-auto mb-2 opacity-50" />
                <p>Fill details to generate QR</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedStage;
