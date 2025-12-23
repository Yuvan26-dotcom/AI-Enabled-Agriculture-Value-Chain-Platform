import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Award, ShieldCheck, IndianRupee, CheckCircle } from 'lucide-react';

const FinancialIncentivesWidget = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        fetchScore();
    }, []);

    const fetchScore = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Simulate data for demo if not logged in
                setData({
                    score: 85,
                    breakdown: [
                        { rule: 'Crop Advisory Usage', points: 10 },
                        { rule: 'Traceable Sales', points: 20 },
                        { rule: 'Timely Harvest', points: 5 },
                        { rule: 'NMEO-OP Priority District', points: 15 }
                    ],
                    eligibleForPremium: true,
                    creditLimit: 500000
                });
                setLoading(false);
                return;
            }

            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/credit/score', config);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching credit score", err);
            // Fallback for demo
            setData({
                score: 85,
                breakdown: [
                    { rule: 'Crop Advisory Usage', points: 10 },
                    { rule: 'Traceable Sales', points: 20 },
                    { rule: 'Timely Harvest', points: 5 },
                    { rule: 'NMEO-OP Priority District', points: 15 }
                ],
                eligibleForPremium: true,
                creditLimit: 500000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post('http://localhost:5000/api/credit/apply-scheme', {}, { headers: { 'x-auth-token': token } });
            }
            setApplied(true);
            alert("Application Submitted Successfully!");
        } catch (err) {
            alert("Application failed.");
        }
    };

    if (loading) return <div className="p-4 bg-white rounded-lg shadow animate-pulse h-64"></div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="text-green-600" /> Financial Incentives
                </h2>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    Performance Based
                </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Score Circle */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eee"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={data.score > 80 ? "#16a34a" : "#ca8a04"}
                            strokeWidth="3"
                            strokeDasharray={`${data.score}, 100`}
                            className="animate-[spin_1s_ease-out_reverse]"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold text-gray-800">{data.score}</span>
                        <span className="text-[10px] text-gray-500">SCORE</span>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3 w-full">
                    {data.eligibleForPremium ? (
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                            <div className="flex items-center gap-2 text-green-800 font-bold mb-1">
                                <ShieldCheck size={18} /> Eligible for Premium Insurance
                            </div>
                            <div className="flex items-center gap-2 text-green-700 text-sm">
                                <IndianRupee size={14} /> Pre-approved Credit: ₹{data.creditLimit.toLocaleString()}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800 text-sm">
                            Improve score to &gt;80 for premium benefits.
                        </div>
                    )}

                    <div className="space-y-1">
                        {data.breakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-gray-600">
                                <span>{item.rule}</span>
                                <span className="font-bold text-green-600">+{item.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                    onClick={handleApply}
                    disabled={applied}
                    className={`w-full py-2 px-4 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors ${
                        applied 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {applied ? (
                        <>
                            <CheckCircle size={18} /> Applied for NMEO-OP
                        </>
                    ) : (
                        <>
                            <Award size={18} /> Apply for NMEO-OP Scheme
                        </>
                    )}
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                    National Mission on Edible Oils - Oil Palm (NMEO-OP)
                </p>
            </div>
        </div>
    );
};

export default FinancialIncentivesWidget;