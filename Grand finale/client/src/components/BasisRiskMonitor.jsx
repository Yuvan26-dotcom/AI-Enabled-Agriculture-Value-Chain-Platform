import React from 'react';
import { Gauge, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const BasisRiskMonitor = () => {
  // Mock Data - In production, fetch from API
  const spotPrice = 5200;
  const futurePrice = 5450;
  const basis = spotPrice - futurePrice; // -250 (Contango)
  
  // Logic: 
  // Negative Basis (Future > Spot) => Contango => Market expects price rise => Lock Forward / Hold
  // Positive Basis (Spot > Future) => Backwardation => Market expects price fall => Sell Spot
  
  const isContango = basis < 0;
  const recommendation = isContango ? "Lock Forward Contract" : "Sell in Spot Market";
  const riskLevel = Math.abs(basis) > 300 ? "High" : Math.abs(basis) > 100 ? "Moderate" : "Low";

  // Gauge Needle Rotation (-90 to 90 deg)
  // Map basis -500 to +500 to -90 to 90
  const rotation = Math.max(-90, Math.min(90, (basis / 500) * 90));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Gauge className="text-purple-600" /> Basis Risk Monitor
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          riskLevel === 'High' ? 'bg-red-100 text-red-700' : 
          riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 
          'bg-green-100 text-green-700'
        }`}>
          {riskLevel} Volatility
        </span>
      </div>

      <div className="flex flex-col items-center justify-center relative mb-6">
        {/* CSS Gauge */}
        <div className="w-48 h-24 bg-gray-200 rounded-t-full relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 opacity-30"></div>
          <div 
            className="absolute bottom-0 left-1/2 w-1 h-24 bg-gray-800 origin-bottom transition-transform duration-1000"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          ></div>
          <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="flex justify-between w-48 text-xs text-gray-500 mt-2">
          <span>Contango (-500)</span>
          <span>Backwardation (+500)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center mb-4">
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500">Spot Price</p>
          <p className="font-bold text-gray-800">₹{spotPrice}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500">Future Price</p>
          <p className="font-bold text-gray-800">₹{futurePrice}</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">Basis (Spot - Future)</span>
          <span className={`font-bold ${basis < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {basis} ({isContango ? 'Contango' : 'Backwardation'})
          </span>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <AlertCircle size={16} className="text-purple-600 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-purple-800">
            Advisory: {recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasisRiskMonitor;
