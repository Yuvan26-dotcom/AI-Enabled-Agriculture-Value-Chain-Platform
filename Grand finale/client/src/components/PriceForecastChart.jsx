import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceDot, Label } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PriceForecastChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [peakDate, setPeakDate] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState("Soybean");

    const crops = [
        "Soybean", "Groundnut", "Mustard", "Sunflower", 
        "Sesame (Til)", "Castor", "Safflower", "Niger", "Linseed"
    ];

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

    // Define distinct market patterns for each crop to ensure realistic variety
    const CROP_PATTERNS = {
        "Soybean": { peakDay: 7, volatility: 50, trend: 1 }, // Peak in 1 week
        "Groundnut": { peakDay: 14, volatility: 40, trend: 0.5 }, // Peak in 2 weeks
        "Mustard": { peakDay: 3, volatility: 60, trend: -0.5 }, // Short term peak
        "Sunflower": { peakDay: 22, volatility: 45, trend: 1.5 }, // Late peak
        "Sesame (Til)": { peakDay: 10, volatility: 100, trend: 2 }, // High value, high volatility
        "Castor": { peakDay: 28, volatility: 30, trend: 0.2 }, // Stable, late peak
        "Safflower": { peakDay: 12, volatility: 40, trend: -1 }, // Mid-term peak then drop
        "Niger": { peakDay: 18, volatility: 50, trend: 0.8 },
        "Linseed": { peakDay: 5, volatility: 35, trend: 0.5 }
    };

    useEffect(() => {
        // Simulate fetching data
        const fetchData = async () => {
            setLoading(true);
            try {
                // Generate Mock Data: 15 days history + 30 days forecast
                const today = new Date();
                const mockData = [];
                const basePrice = BASE_PRICES[selectedCrop] || 5000;
                const pattern = CROP_PATTERNS[selectedCrop] || { peakDay: 10, volatility: 50, trend: 0 };
                
                // Historical Data (Solid Line) - Realistic Random Walk
                let currentHistoryPrice = basePrice + (Math.random() * 300 - 150); // Start with variance

                for (let i = 15; i > 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    
                    // Random walk logic: Previous price + random fluctuation + slight trend
                    const dailyChange = (Math.random() - 0.5) * pattern.volatility * 2;
                    const marketSentiment = (Math.random() - 0.5) * 5; // Minor drift
                    
                    currentHistoryPrice += dailyChange + marketSentiment;

                    mockData.push({
                        date: d.toISOString().split('T')[0],
                        historical: currentHistoryPrice,
                        forecast: null
                    });
                }

                // Forecast Data (Dashed Line)
                let currentPrice = mockData[mockData.length - 1].historical;
                let maxPrice = 0;
                let maxDate = null;

                for (let i = 0; i < 30; i++) {
                    const d = new Date(today);
                    d.setDate(d.getDate() + i);
                    
                    // Calculate Trend
                    let dailyChange = (Math.random() * pattern.volatility) - (pattern.volatility / 2);
                    
                    // Apply Peak Logic
                    // If we are approaching the specific peak day for this crop, push price up
                    if (i >= pattern.peakDay - 2 && i <= pattern.peakDay + 2) {
                        dailyChange += (pattern.volatility * 1.5); 
                    }
                    
                    // Apply General Trend
                    dailyChange += pattern.trend * 5;

                    currentPrice += dailyChange;
                    
                    if (currentPrice > maxPrice) {
                        maxPrice = currentPrice;
                        maxDate = d.toISOString().split('T')[0];
                    }

                    mockData.push({
                        date: d.toISOString().split('T')[0],
                        historical: null, 
                        forecast: currentPrice
                    });
                }

                // Connect the lines visually by adding a point with both values at 'today'
                const todayStr = today.toISOString().split('T')[0];
                const todayIndex = mockData.findIndex(d => d.date === todayStr);
                if (todayIndex !== -1) {
                    mockData[todayIndex].historical = mockData[todayIndex-1].historical; 
                    mockData[todayIndex].forecast = mockData[todayIndex].historical;
                }

                setData(mockData);
                setPeakDate(maxDate);

            } catch (error) {
                console.error("Error loading chart data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCrop]);

    if (loading) return <div className="h-64 flex items-center justify-center">Loading Forecast...</div>;

    const peakDataPoint = data.find(d => d.date === peakDate);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">{selectedCrop} Price Forecast (30 Days)</h3>
                <div className="flex gap-4 items-center">
                    {peakDataPoint && (
                        <div className="hidden md:flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            <TrendingUp size={16} />
                            Sell Signal: {peakDate}
                        </div>
                    )}
                    <select 
                        value={selectedCrop} 
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {crops.map(crop => (
                            <option key={crop} value={crop}>{crop}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(str) => str.slice(5)} />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        
                        {/* Historical Line */}
                        <Line 
                            type="monotone" 
                            dataKey="historical" 
                            stroke="#2563eb" 
                            strokeWidth={2} 
                            name="Historical Price" 
                            dot={false} 
                        />
                        
                        {/* Forecast Line */}
                        <Line 
                            type="monotone" 
                            dataKey="forecast" 
                            stroke="#9333ea" 
                            strokeWidth={2} 
                            strokeDasharray="5 5" 
                            name="AI Forecast" 
                            dot={false} 
                        />

                        {/* Sell Signal Annotation */}
                        {peakDataPoint && (
                            <ReferenceDot 
                                x={peakDate} 
                                y={peakDataPoint.forecast} 
                                r={6} 
                                fill="red" 
                                stroke="none"
                            >
                                <Label value="SELL" position="top" fill="red" fontWeight="bold" />
                            </ReferenceDot>
                        )}
                        
                        {/* Today Line */}
                        <ReferenceLine x={new Date().toISOString().split('T')[0]} stroke="green" label="Today" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
                *Dashed line represents AI-predicted price range. Past performance is not indicative of future results.
            </p>
        </div>
    );
};

export default PriceForecastChart;