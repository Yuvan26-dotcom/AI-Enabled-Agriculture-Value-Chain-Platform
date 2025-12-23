import React, { useState } from 'react';
import { Microscope, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

const AssayerVerification = () => {
  const [contractId, setContractId] = useState('');
  const [step, setStep] = useState(1); // 1: Search, 2: Verify
  const [labData, setLabData] = useState({
    oilContent: '',
    moisture: '',
    foreignMatter: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (contractId) {
      // Simulate fetching contract details
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call to update Smart Contract
    setTimeout(() => {
      setVerificationResult({
        status: 'QUALITY_VERIFIED',
        penaltyApplied: parseFloat(labData.oilContent) < 18, // Example logic
        timestamp: new Date().toLocaleString()
      });
    }, 1000);
  };

  if (verificationResult) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Complete</h2>
        <p className="text-gray-600 mb-6">
          Quality data has been cryptographically signed and pushed to the Smart Contract.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Contract ID:</span>
            <span className="font-mono font-bold">{contractId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="text-green-600 font-bold">VERIFIED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Penalty Triggered:</span>
            <span className={verificationResult.penaltyApplied ? "text-red-600 font-bold" : "text-gray-800"}>
              {verificationResult.penaltyApplied ? "YES" : "NO"}
            </span>
          </div>
        </div>

        <button 
          onClick={() => { setStep(1); setVerificationResult(null); setContractId(''); setLabData({oilContent:'', moisture:'', foreignMatter:''}); }}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Verify Another Lot
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-indigo-900 text-white p-4 flex items-center gap-3">
        <Microscope size={24} />
        <div>
          <h2 className="font-bold text-lg">Assayer Portal</h2>
          <p className="text-xs text-indigo-200">Neutral Quality Verification</p>
        </div>
      </div>

      <div className="p-6">
        {step === 1 ? (
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract / Lot ID</label>
              <input 
                type="text" 
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
                placeholder="e.g. SC-2024-8892"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">
              Fetch Lot Details
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right-4">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4 flex items-start gap-2">
              <FileText size={16} className="mt-0.5 shrink-0" />
              <div>
                <p><strong>Contract:</strong> {contractId}</p>
                <p><strong>Commodity:</strong> Soybean (Yellow)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oil Content (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={labData.oilContent}
                  onChange={(e) => setLabData({...labData, oilContent: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Moisture (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={labData.moisture}
                  onChange={(e) => setLabData({...labData, moisture: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foreign Matter (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={labData.foreignMatter}
                onChange={(e) => setLabData({...labData, foreignMatter: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <p>
                By submitting, you certify these results are from an NABL accredited lab. 
                False reporting is liable for legal action.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg"
              >
                Submit & Verify
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssayerVerification;
