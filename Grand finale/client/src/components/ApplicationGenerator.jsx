import React, { useState } from 'react';
import { FileText, CheckCircle, ExternalLink, Lock, Award, Search, Loader2 } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const ApplicationGenerator = ({ loanDetails, loanType = 'KCC' }) => {
  const { pledgeCrop } = useInventory();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    landRecordId: '',
    totalArea: ''
  });

  const handleVerify = () => {
    if (!formData.landRecordId) {
      alert("Please enter a Land Record ID (Survey Number)");
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate Bhulekh fetch
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setFormData(prev => ({
        ...prev,
        name: "Rajesh Kumar Verma",
        totalArea: "2.5 Acres",
        aadhaar: "XXXX-XXXX-4589" // Partially masked
      }));
    }, 2000);
  };

  const handleSubmit = () => {
    if (!isVerified) {
      alert("Please verify your Land Record ID first.");
      return;
    }
    setIsGenerating(true);
    
    // Simulate processing
    setTimeout(() => {
      // Pledge the crop
      if (loanDetails && loanDetails.crop) {
        // Calculate collateral quantity (e.g., Loan Amount / (Market Price * 0.7 LTV))
        // Assuming approx 4000/Qtl valuation for collateral
        const collateralQty = Math.ceil(loanDetails.totalLimit / 4000);
        pledgeCrop(loanDetails.crop, '8821', collateralQty, loanType); 
      }

      setIsGenerating(false);
      setShowSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.open('https://www.jansamarth.in', '_blank');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col relative">
      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-green-100 p-4 rounded-full mb-4 animate-bounce">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Dossier Generated!</h3>
          <p className="text-gray-600 mb-6">Redirecting to JanSamarth Portal with your verified Scorecard & Loan Calculation...</p>
          <div className="flex items-center gap-2 text-blue-600 font-semibold">
            <Loader2 className="animate-spin" size={20} />
            Redirecting...
          </div>
        </div>
      )}

      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gray-800 p-2 rounded-lg">
            <Award className="text-yellow-400" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Biometrix Scorecard</h2>
            <p className="text-xs text-gray-400">Creditworthiness Assessment</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400 leading-none">780</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Excellent</div>
        </div>
      </div>

      <div className="p-6 flex-grow space-y-6 overflow-y-auto">
        {/* Score Contributors */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Score Contributors</h4>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Digital Footprint (Traceability)</span>
              <span className="text-green-600 font-bold">High</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%] rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Climate Resilience (Advisory)</span>
              <span className="text-blue-600 font-bold">Good</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[70%] rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Harvest Consistency (Yield)</span>
              <span className="text-yellow-600 font-bold">Stable</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 w-[90%] rounded-full"></div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* e-Verification Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 uppercase">e-Verification (Bhulekh)</h4>
            {isVerified && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><CheckCircle size={12}/> Verified</span>}
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">Land Record ID (Survey No.)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={formData.landRecordId}
                onChange={(e) => setFormData({...formData, landRecordId: e.target.value})}
                placeholder="e.g. MP-IND-2024-789"
                disabled={isVerified}
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-gray-50"
              />
              <button 
                onClick={handleVerify}
                disabled={isVerifying || isVerified || !formData.landRecordId}
                className={`px-4 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-2 transition-all ${
                  isVerified ? 'bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-70`}
              >
                {isVerifying ? <Loader2 className="animate-spin" size={16} /> : isVerified ? <CheckCircle size={16} /> : 'Verify'}
              </button>
            </div>
          </div>

          {isVerified && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="block text-[10px] text-gray-500 uppercase">Farmer Name</label>
                <div className="font-bold text-gray-800 text-sm">{formData.name}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="block text-[10px] text-gray-500 uppercase">Total Area</label>
                <div className="font-bold text-gray-800 text-sm">{formData.totalArea}</div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
            <span className="text-sm text-gray-600">Calculated Loan Limit</span>
            <span className="font-bold text-lg text-blue-800">
              {loanDetails ? `₹ ${Math.round(loanDetails.totalLimit).toLocaleString()}` : '---'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isGenerating || showSuccess || !isVerified}
          className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
            !isVerified ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <>Processing Dossier...</>
          ) : (
            <>
              Generate JanSamarth Dossier <ExternalLink size={18} />
            </>
          )}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
          <Lock size={10} /> 
          <span>Secure Blockchain Transmission</span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationGenerator;

