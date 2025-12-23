import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, IndianRupee } from 'lucide-react';

// Realistic Agmarknet-style data (simulated) for past 10 years
const historicalData = {
  'Soybean': [
    { year: '2014', price: 3400 },
    { year: '2015', price: 3650 },
    { year: '2016', price: 3200 },
    { year: '2017', price: 3050 },
    { year: '2018', price: 3400 },
    { year: '2019', price: 3800 },
    { year: '2020', price: 4200 },
    { year: '2021', price: 6500 }, // Spike
    { year: '2022', price: 5800 },
    { year: '2023', price: 4900 },
    { year: '2024', price: 4600 },
  ],
  'Groundnut': [
    { year: '2014', price: 4200 },
    { year: '2015', price: 4500 },
    { year: '2016', price: 4800 },
    { year: '2017', price: 4600 },
    { year: '2018', price: 4900 },
    { year: '2019', price: 5200 },
    { year: '2020', price: 5600 },
    { year: '2021', price: 6100 },
    { year: '2022', price: 6400 },
    { year: '2023', price: 6800 },
    { year: '2024', price: 7100 },
  ],
  'Mustard': [
    { year: '2014', price: 3100 },
    { year: '2015', price: 3300 },
    { year: '2016', price: 3600 },
    { year: '2017', price: 3800 },
    { year: '2018', price: 3900 },
    { year: '2019', price: 4100 },
    { year: '2020', price: 4400 },
    { year: '2021', price: 5800 },
    { year: '2022', price: 6200 },
    { year: '2023', price: 5400 },
    { year: '2024', price: 5100 },
  ],
  'Sunflower': [
    { year: '2014', price: 3800 },
    { year: '2015', price: 3900 },
    { year: '2016', price: 4100 },
    { year: '2017', price: 3950 },
    { year: '2018', price: 4200 },
    { year: '2019', price: 4400 },
    { year: '2020', price: 4800 },
    { year: '2021', price: 5900 },
    { year: '2022', price: 6300 },
    { year: '2023', price: 5800 },
    { year: '2024', price: 5600 },
  ],
  'Sesame': [
    { year: '2014', price: 7500 },
    { year: '2015', price: 8200 },
    { year: '2016', price: 7800 },
    { year: '2017', price: 8500 },
    { year: '2018', price: 9200 },
    { year: '2019', price: 10500 },
    { year: '2020', price: 11200 },
    { year: '2021', price: 10800 },
    { year: '2022', price: 11500 },
    { year: '2023', price: 12500 },
    { year: '2024', price: 13200 },
  ]
};

const PriceTrendChart = ({ selectedCrop }) => {
  // Default to Soybean if crop not found
  const data = historicalData[selectedCrop] || historicalData['Soybean'];
  const cropName = historicalData[selectedCrop] ? selectedCrop : 'Soybean';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-purple-600" /> 
            10-Year Price Trend (Agmarknet Data)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Historical market prices for <span className="font-bold text-purple-700">{cropName}</span> (2014-2024)
          </p>
        </div>
        <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-100">
          <span className="text-xs text-gray-500 uppercase font-bold">Current Trend</span>
          <div className="flex items-center text-green-600 font-bold">
            <TrendingUp size={16} className="mr-1" /> Bullish
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }}
              formatter={(value) => [`₹${value}`, 'Avg Price']}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              dataKey="price" 
              name="Average Mandi Price (INR/Qtl)" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center italic">
        Source: Agmarknet Historical Data (Simulated for Prototype)
      </div>
    </div>
  );
};

export default PriceTrendChart;
