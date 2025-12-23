import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AgmarknetTicker = () => {
    const { t } = useTranslation();
    const [marketData, setMarketData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/market-prices');
                setMarketData(res.data);
            } catch (error) {
                console.error("Error fetching market data", error);
            }
        };
        fetchData();
        // Refresh every 5 seconds to show live fluctuations
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-900 text-white overflow-hidden py-2 shadow-md border-b border-gray-700">
            <div className="flex items-center">
                <div className="bg-red-700 px-4 py-1 font-bold text-xs uppercase tracking-wider z-10 shadow-lg whitespace-nowrap">
                    {t('live_rates')}
                </div>
                <div className="animate-marquee whitespace-nowrap flex gap-8 px-4">
                    {marketData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-yellow-400">{item.crop}</span>
                            <span className="text-gray-300">({item.market})</span>
                            <span className="font-mono">₹{item.price}/Q</span>
                            <span className={`text-xs ${item.trend === 'up' ? 'text-green-400' : item.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                                {item.change}
                            </span>
                            {item.trend === 'up' && <TrendingUp size={14} className="text-green-500" />}
                            {item.trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
                            {item.trend === 'stable' && <Minus size={14} className="text-gray-400" />}
                        </div>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {marketData.map((item, index) => (
                        <div key={`dup-${index}`} className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-yellow-400">{item.crop}</span>
                            <span className="text-gray-300">({item.market})</span>
                            <span className="font-mono">₹{item.price}/Q</span>
                            <span className={`text-xs ${item.trend === 'up' ? 'text-green-400' : item.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                                {item.change}
                            </span>
                            {item.trend === 'up' && <TrendingUp size={14} className="text-green-500" />}
                            {item.trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
                            {item.trend === 'stable' && <Minus size={14} className="text-gray-400" />}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export default AgmarknetTicker;
