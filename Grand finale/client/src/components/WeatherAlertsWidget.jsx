import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, CloudRain, Info } from 'lucide-react';

const WeatherAlertsWidget = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                // Fetch from our AI Service
                const aiUrl = import.meta.env.VITE_AI_URL || 'http://localhost:8000';
                const res = await axios.get(`${aiUrl}/weather-alerts`);
                setAlerts(res.data);
                setError(false);
            } catch (err) {
                console.error("Failed to fetch weather alerts", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
        // Refresh every 5 minutes
        const interval = setInterval(fetchAlerts, 300000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
                <div className="h-16 bg-gray-100 rounded"></div>
                <div className="h-16 bg-gray-100 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <CloudRain className="text-blue-600" /> IMD Weather Alerts
                </h2>
                <span className="text-xs text-gray-500">Source: mausam.imd.gov.in</span>
            </div>

            {error ? (
                <div className="text-red-500 text-sm">Unable to load live alerts. Please check connection.</div>
            ) : (
                <div className="space-y-3">
                    {alerts.length === 0 ? (
                        <div className="p-4 bg-green-50 text-green-800 rounded border border-green-200">
                            No severe weather warnings at this time.
                        </div>
                    ) : (
                        alerts.map((alert, index) => (
                            <div key={index} className={`p-3 border-l-4 rounded ${
                                alert.severity === 'High' ? 'bg-red-50 border-red-500 text-red-800' : 
                                alert.severity === 'Medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' : 
                                'bg-blue-50 border-blue-400 text-blue-800'
                            }`}>
                                <div className="flex items-start gap-2">
                                    <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm">{alert.title}</p>
                                        <p className="text-xs mt-1">{alert.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default WeatherAlertsWidget;
