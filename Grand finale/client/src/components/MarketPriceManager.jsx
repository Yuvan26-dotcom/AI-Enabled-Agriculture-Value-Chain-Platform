import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Save, RefreshCw } from 'lucide-react';

const MarketPriceManager = () => {
  // In a real app, fetch this from API
  const [prices, setPrices] = useState([
    { id: 1, crop: 'Soybean', msp: 4600, marketPrice: 4850, trend: 'up' },
    { id: 2, crop: 'Groundnut', msp: 6377, marketPrice: 6500, trend: 'stable' },
    { id: 3, crop: 'Mustard', msp: 5450, marketPrice: 5600, trend: 'up' },
    { id: 4, crop: 'Sunflower', msp: 6400, marketPrice: 6200, trend: 'down' },
  ]);

  const handlePriceChange = (id, field, value) => {
    setPrices(prices.map(p => p.id === id ? { ...p, [field]: Number(value) } : p));
  };

  const handleSave = () => {
    // API call to save prices would go here
    // api.post('/api/market/prices', { prices });
    alert("Market prices updated successfully! These will now be reflected in the Farmer and Buyer portals.");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <IndianRupee className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Market Price Control</h2>
            <p className="text-sm text-gray-500">Set MSP and Base Market Rates for Trading</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
        >
          <Save size={18} /> Update Prices
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
            <tr>
              <th className="p-3 rounded-l-lg">Crop Name</th>
              <th className="p-3">MSP (₹/Quintal)</th>
              <th className="p-3">Current Market Rate (₹)</th>
              <th className="p-3 rounded-r-lg">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {prices.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium text-gray-800">{item.crop}</td>
                <td className="p-3">
                  <input 
                    type="number" 
                    value={item.msp}
                    onChange={(e) => handlePriceChange(item.id, 'msp', e.target.value)}
                    className="w-24 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="number" 
                    value={item.marketPrice}
                    onChange={(e) => handlePriceChange(item.id, 'marketPrice', e.target.value)}
                    className="w-24 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none font-bold text-green-700"
                  />
                </td>
                <td className="p-3">
                  {item.trend === 'up' && <span className="text-green-600 flex items-center gap-1"><TrendingUp size={16} /> Rising</span>}
                  {item.trend === 'down' && <span className="text-red-600 flex items-center gap-1"><TrendingUp size={16} className="rotate-180" /> Falling</span>}
                  {item.trend === 'stable' && <span className="text-gray-500 flex items-center gap-1"><TrendingUp size={16} className="rotate-90" /> Stable</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm text-blue-700 flex items-center gap-2">
        <RefreshCw size={16} />
        Prices are automatically synced with the National Commodity Exchange every 24 hours. Manual overrides persist for 4 hours.
      </div>
    </div>
  );
};

export default MarketPriceManager;
