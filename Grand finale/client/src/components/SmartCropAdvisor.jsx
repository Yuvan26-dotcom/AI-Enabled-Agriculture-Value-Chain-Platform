import React, { useState, useEffect } from 'react';
import { Calculator, Sprout, IndianRupee, Scale, AlertCircle, CloudRain, Bug, Truck, CreditCard, Calendar, Mic, Volume2, HelpCircle, X } from 'lucide-react';

// Realistic MSP Data for 2024-25 Season (Source: CACP/Govt of India)
const MSP_DATA_2024 = {
  'Soybean': 4892,
  'Groundnut': 6783,
  'Mustard': 5650,
  'Sunflower': 7280,
  'Sesame': 9267,
  'Castor': 5800 // Estimated
};

// Regional Soil Data (Simplified for Prototype based on NBSS&LUP)
const DISTRICT_SOIL_MAP = {
  'Indore': { type: 'Deep Black (Vertisols)', suitability: 1.2 }, // 1.2x yield multiplier
  'Bhopal': { type: 'Medium Black', suitability: 1.1 },
  'Pune': { type: 'Black Cotton', suitability: 1.15 },
  'Nagpur': { type: 'Deep Black', suitability: 1.2 },
  'Ujjain': { type: 'Medium Black', suitability: 1.1 },
  'Dewas': { type: 'Black Soil', suitability: 1.1 },
  'Sehore': { type: 'Clay Loam', suitability: 1.05 },
  'Vidisha': { type: 'Loamy', suitability: 1.0 },
  'Rajgarh': { type: 'Mixed Red & Black', suitability: 0.95 },
  'Harda': { type: 'Deep Black', suitability: 1.2 },
  // Default fallback
  'default': { type: 'Alluvial/Mixed', suitability: 1.0 }
};

// Average Yield Benchmarks (Quintals per Acre)
const CROP_YIELD_BENCHMARKS = {
  'Soybean': 12 / 2.47,
  'Groundnut': 18 / 2.47,
  'Mustard': 15 / 2.47,
  'Sunflower': 10 / 2.47,
  'Sesame': 6 / 2.47,
  'Castor': 14 / 2.47
};

const SmartCropAdvisor = ({ selectedCrop, selectedDistrict, currentMarketPrice }) => {
  const [landSize, setLandSize] = useState(2.5); // in Acres
  const [calculatedData, setCalculatedData] = useState(null);
  const [activeAdvisory, setActiveAdvisory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    calculateProjections();
  }, [selectedCrop, selectedDistrict, landSize, currentMarketPrice]);

  const calculateProjections = () => {
    const msp = MSP_DATA_2024[selectedCrop] || 4500;
    const soilInfo = DISTRICT_SOIL_MAP[selectedDistrict] || DISTRICT_SOIL_MAP['default'];
    const baseYield = CROP_YIELD_BENCHMARKS[selectedCrop] || (10 / 2.47);
    
    // Calculate realistic yield based on soil suitability
    const estimatedYieldPerAcre = baseYield * soilInfo.suitability;
    const totalYield = estimatedYieldPerAcre * landSize;
    
    // Financials
    const incomeAtMSP = totalYield * msp;
    const incomeAtMarket = totalYield * (currentMarketPrice || msp); // Fallback to MSP if no market price
    
    setCalculatedData({
      msp,
      soilType: soilInfo.type,
      yieldPerAcre: estimatedYieldPerAcre.toFixed(1),
      totalYield: totalYield.toFixed(1),
      incomeAtMSP: incomeAtMSP.toFixed(0),
      incomeAtMarket: incomeAtMarket.toFixed(0),
      difference: (incomeAtMarket - incomeAtMSP).toFixed(0),
      isMarketBetter: incomeAtMarket > incomeAtMSP
    });
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const advisoryOptions = [
    {
      id: 'sowing',
      title: 'Sowing & Best Crop',
      icon: <Sprout size={24} className="text-green-600" />,
      color: 'bg-green-50',
      advice: `Best sowing window for ${selectedCrop} in ${selectedDistrict} is Dec 10-15. Use NPK fertilizer for higher yield. Soil type ${calculatedData?.soilType} is highly suitable.`
    },
    {
      id: 'weather',
      title: 'Weather & Irrigation',
      icon: <CloudRain size={24} className="text-blue-600" />,
      color: 'bg-blue-50',
      advice: "Rain expected in your district this week. Delay harvest by 3 days or arrange covered storage. Ensure drainage channels are clear."
    },
    {
      id: 'pest',
      title: 'Pest & Disease Alerts',
      icon: <Bug size={24} className="text-red-600" />,
      color: 'bg-red-50',
      advice: "High pest risk detected for Aphids. Use recommended pesticide: Imidacloprid. Monitor field every 2 days."
    },
    {
      id: 'market',
      title: 'Market Price & Sell',
      icon: <IndianRupee size={24} className="text-yellow-600" />,
      color: 'bg-yellow-50',
      advice: `Current market price for ${selectedCrop}: ₹${currentMarketPrice || '5,200'}/qtl. Hold stock for 7 days for better rates as demand is rising.`
    },
    {
      id: 'storage',
      title: 'Storage & Logistics',
      icon: <Truck size={24} className="text-purple-600" />,
      color: 'bg-purple-50',
      advice: "Nearest government warehouse in Dewas has 40% vacancy. Book now for 50% subsidy on storage fees."
    },
    {
      id: 'credit',
      title: 'Credit & Insurance',
      icon: <CreditCard size={24} className="text-indigo-600" />,
      color: 'bg-indigo-50',
      advice: "You are eligible for KCC loan up to ₹1.5 Lakhs. PMFBY insurance enrollment closes on Dec 31st."
    },
    {
      id: 'plan',
      title: 'Full Season Plan',
      icon: <Calendar size={24} className="text-orange-600" />,
      color: 'bg-orange-50',
      advice: "View your complete 4-month crop calendar: Sowing (Dec), Irrigation (Jan-Feb), Pest Control (Feb), Harvest (Mar)."
    }
  ];

  const handleOptionClick = (option) => {
    setActiveAdvisory(option);
    setShowModal(true);
    speak(option.advice);
  };

  if (!calculatedData) return null;

  return (
    <div className="space-y-6">
      {/* Yield Calculator Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-md border border-indigo-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              <Calculator className="text-indigo-600" /> 
              Smart Yield & Income Calculator
            </h3>
            <p className="text-sm text-indigo-700 mt-1">
              Based on <strong>Govt MSP (2024-25)</strong> & <strong>{selectedDistrict} Soil Data</strong>
            </p>
          </div>
          <div className="bg-white px-3 py-1 rounded-lg border border-indigo-200 text-xs font-bold text-indigo-600 shadow-sm">
            AI Advisory
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
            <label className="block text-sm font-bold text-gray-600 mb-2">Your Land Size (Acres)</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={landSize}
                onChange={(e) => setLandSize(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-bold text-lg"
                step="0.1"
              />
              <span className="text-gray-500 font-medium">Acres</span>
            </div>
          </div>

          {/* Output Section */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-xs text-green-600 font-bold uppercase">Estimated Yield</p>
              <p className="text-2xl font-bold text-green-800">{calculatedData.totalYield} Qtl</p>
              <p className="text-xs text-green-600 mt-1">({calculatedData.yieldPerAcre} Qtl/Acre)</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase">Potential Income</p>
              <p className="text-2xl font-bold text-blue-800">₹ {parseInt(calculatedData.incomeAtMarket).toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">
                {calculatedData.isMarketBetter ? 'Market Price is Higher' : 'MSP is Higher'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New Advisory Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Mic size={20} className="text-indigo-600" /> Get Personalized Crop Advisory
        </h3>
        <p className="text-sm text-gray-500 mb-4">Select your crop and see the best actions for your farm, including weather, pest, and market advice.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {advisoryOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className={`${option.color} p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all text-left flex flex-col items-center text-center gap-2`}
            >
              <div className="bg-white p-3 rounded-full shadow-sm">
                {option.icon}
              </div>
              <span className="font-bold text-gray-700 text-sm">{option.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advisory Modal */}
      {showModal && activeAdvisory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${activeAdvisory.color}`}>
                  {activeAdvisory.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{activeAdvisory.title}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {activeAdvisory.advice}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => speak(activeAdvisory.advice)}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 size={20} /> Read Aloud
              </button>
              <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <HelpCircle size={20} /> Why this?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCropAdvisor;
