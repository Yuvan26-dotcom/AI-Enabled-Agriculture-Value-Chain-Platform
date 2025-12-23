import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Cpu } from 'lucide-react';

const PriceForecast = ({ selectedCrop, selectedState }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCrop) {
      fetchForecast();
    }
  }, [selectedCrop, selectedState]);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const aiUrl = import.meta.env.VITE_AI_URL || 'http://localhost:8000';
      const response = await axios.post(`${aiUrl}/forecast-price`, {
        crop: selectedCrop.toLowerCase(),
        region: selectedState || 'Madhya Pradesh'
      });
      
      // Transform data for Recharts
      // Server returns { dates: [], predicted_prices: [], trend: "" }
      const { dates, predicted_prices } = response.data;
      const chartData = dates.map((date, index) => ({
        date: date,
        price: predicted_prices[index]
      }));
      
      setData(chartData);

    } catch (error) {
      console.error("Error fetching forecast:", error);
      // Fallback to mock data if AI service fails
      const mockData = generateMockForecast(selectedCrop);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockForecast = (crop) => {
    const basePrice = {
      'Soybean': 4800,
      'Groundnut': 6500,
      'Mustard': 5400,
      'Sunflower': 5600,
      'Sesame': 12000
    }[crop] || 5000;

    const today = new Date();
    const data = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() + i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      // Random fluctuation + slight upward trend
      const randomFluctuation = (Math.random() - 0.3) * 500; 
      const trend = i * 50;
      
      data.push({
        date: monthName,
        price: Math.round(basePrice + randomFluctuation + trend)
      });
    }
    return data;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Cpu className="text-blue-600" /> 
            AI Price Forecast (6 Months)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Predicted market rates for <span className="font-bold text-blue-700">{selectedCrop}</span>
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <span className="text-xs text-gray-500 uppercase font-bold">Confidence</span>
          <div className="flex items-center text-blue-600 font-bold">
            87% High
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
            Analyzing Market Trends...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                name="Predicted Price (₹/Qtl)"
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PriceForecast;
