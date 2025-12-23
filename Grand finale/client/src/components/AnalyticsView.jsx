import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const AnalyticsView = ({ initialCrop = "Soybean" }) => {
    const [selectedCrop, setSelectedCrop] = useState(initialCrop);

    // Expanded MSP Data (Approximate 2024-25 values)
    const MSP_DATA = {
        "Soybean": 4600,
        "Groundnut": 6377,
        "Mustard": 5650,
        "Sunflower": 6760,
        "Sesame (Til)": 8635,
        "Castor": 6000, // Market driven
        "Safflower": 5800,
        "Niger": 7734,
        "Linseed": 5500
    };

    // Base Prices for simulation
    const BASE_PRICES = {
        "Soybean": 4500,
        "Groundnut": 6200,
        "Mustard": 5400,
        "Sunflower": 5800,
        "Sesame (Til)": 12000,
        "Castor": 6000,
        "Safflower": 5300,
        "Niger": 7000,
        "Linseed": 5700
    };

    const cropOptions = Object.keys(BASE_PRICES);

    const generateForecastData = (crop) => {
        const basePrice = BASE_PRICES[crop] || 4000;
        const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
        
        return months.map((month, index) => {
            // Simulate +/- 5% fluctuation
            const fluctuation = (Math.random() * 0.1) - 0.05; 
            // Add a slight upward trend for later months
            const trend = index * 0.01; 
            
            const price = Math.round(basePrice * (1 + fluctuation + trend));
            return {
                month,
                price,
                msp: MSP_DATA[crop] || 4500
            };
        });
    };

    const data = useMemo(() => generateForecastData(selectedCrop), [selectedCrop]);
    const currentMSP = MSP_DATA[selectedCrop] || 4500;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-[350px] w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                    6-Month Price Forecast
                </h3>
                <select 
                    value={selectedCrop} 
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                    {cropOptions.map(crop => (
                        <option key={crop} value={crop}>{crop}</option>
                    ))}
                </select>
            </div>
            
            <ResponsiveContainer width="100%" height="85%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        itemStyle={{ color: '#059669' }}
                    />
                    <Legend />
                    
                    {/* Forecast Line */}
                    <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#10b981" // Emerald Green
                        strokeWidth={3}
                        activeDot={{ r: 6 }} 
                        name={`${selectedCrop} Price (₹/Q)`}
                    />

                    {/* MSP Reference Line */}
                    <ReferenceLine y={currentMSP} stroke="red" strokeDasharray="3 3" label={{ position: 'top',  value: `MSP: ₹${currentMSP}`, fill: 'red', fontSize: 12 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsView;