import React, { useState } from 'react';
import { Calculator, IndianRupee, ExternalLink, ShieldCheck, Percent } from 'lucide-react';

const CROPS = [
  { name: "Soybean", season: "Kharif", sof: 40000 },
  { name: "Groundnut", season: "Kharif", sof: 38000 },
  { name: "Mustard", season: "Rabi", sof: 35000 },
  { name: "Sunflower", season: "Kharif", sof: 36000 },
  { name: "Sesame", season: "Kharif", sof: 32000 },
  { name: "Castor", season: "Kharif", sof: 30000 },
  { name: "Safflower", season: "Rabi", sof: 34000 },
  { name: "Linseed", season: "Rabi", sof: 33000 }
];

const CreditCalculator = () => {
  const [crop, setCrop] = useState(CROPS[0].name);
  const [area, setArea] = useState(2); // Default 2 acres
  
  const selectedCrop = CROPS.find(c => c.name === crop);
  const scaleOfFinance = selectedCrop ? selectedCrop.sof : 35000;
  
  // Calculations
  const maxLoan = area * scaleOfFinance;
  
  // Premium: 2% for Kharif, 1.5% for Rabi
  const premiumRate = selectedCrop?.season === "Rabi" ? 0.015 : 0.02;
  const insurancePremium = maxLoan * premiumRate;
  
  // Interest Subvention (3% Govt Subsidy)
  const interestSubsidy = maxLoan * 0.03;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <Calculator className="text-blue-600" />
        <h2 className="text-lg font-bold text-gray-800">KCC Loan & Insurance Calculator</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Select Crop</label>
          <select 
            value={crop} 
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {CROPS.map(c => (
              <option key={c.name} value={c.name}>{c.name} ({c.season})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Land Area (Acres)</label>
          <input 
            type="number" 
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            min="0.5"
            step="0.5"
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-3 bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <IndianRupee size={16} className="text-green-600"/> Eligible KCC Limit
          </span>
          <span className="font-bold text-lg text-gray-800">₹ {maxLoan.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <Percent size={16} className="text-blue-600"/> Govt Interest Subsidy (3%)
          </span>
          <span className="font-semibold text-green-600 text-sm">Save ₹ {interestSubsidy.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <ShieldCheck size={16} className="text-orange-600"/> PMFBY Insurance Premium
          </span>
          <span className="font-semibold text-gray-800 text-sm">₹ {insurancePremium.toLocaleString()}</span>
        </div>
      </div>

      <a 
        href="https://www.jansamarth.in" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
      >
        Apply on JanSamarth <ExternalLink size={16} />
      </a>
      <p className="text-[10px] text-center text-gray-400 mt-2">
        Official Govt of India Portal for Credit Linked Schemes
      </p>
    </div>
  );
};

export default CreditCalculator;
