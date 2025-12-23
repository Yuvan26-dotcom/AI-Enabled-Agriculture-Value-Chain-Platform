import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const MarketStatsTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/market-prices');
                setData(res.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching stats", error);
                setError("Failed to load market data. Ensure backend is running on port 5000.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-4 text-center text-gray-500">Loading Agmarknet Stats...</div>;
    if (error) return <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Major Oilseed Market Statistics</h3>
                <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">
                    Source: Agmarknet.gov.in
                </a>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Commodity</th>
                            <th className="px-6 py-3">Market (Mandi)</th>
                            <th className="px-6 py-3 text-right">Arrivals</th>
                            <th className="px-6 py-3 text-right">Modal Price (₹/Q)</th>
                            <th className="px-6 py-3 text-center">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{row.crop}</td>
                                <td className="px-6 py-4 text-gray-600">{row.market}</td>
                                <td className="px-6 py-4 text-right font-mono text-gray-600">{row.arrival || 'N/A'}</td>
                                <td className="px-6 py-4 text-right font-bold text-gray-800">₹{row.price.toLocaleString()}</td>
                                <td className="px-6 py-4 flex flex-col items-center justify-center">
                                    {row.trend === 'up' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><ArrowUpRight size={12}/> Up</span>}
                                    {row.trend === 'down' && <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><ArrowDownRight size={12}/> Down</span>}
                                    {row.trend === 'stable' && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Minus size={12}/> Stable</span>}
                                    {row.change && <span className={`text-xs mt-1 font-medium ${row.trend === 'up' ? 'text-green-600' : row.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>{row.change}</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarketStatsTable;
