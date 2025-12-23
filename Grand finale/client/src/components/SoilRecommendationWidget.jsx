import React, { useState } from 'react';
import axios from 'axios';
import { Sprout, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';

const SoilRecommendationWidget = () => {
  const [soilParams, setSoilParams] = useState({
    soil_type: 'Black Soil',
    nitrogen: 220,
    phosphorus: 40,
    potassium: 150,
    ph_level: 7.2
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/soil/recommend/soil', soilParams);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Droplets className="text-blue-600" /> AI Soil Doctor
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500">Soil Type</label>
          <select 
            className="w-full p-2 border rounded text-sm"
            value={soilParams.soil_type}
            onChange={e => setSoilParams({...soilParams, soil_type: e.target.value})}
          >
            <option value="Black Soil">Black Soil (Regur)</option>
            <option value="Alluvial Soil">Alluvial Soil</option>
            <option value="Red Soil">Red Soil</option>
            <option value="Sandy Soil">Sandy Soil</option>
            <option value="Lateritic Soil">Lateritic Soil</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">pH Level</label>
          <input 
            type="number" step="0.1"
            className="w-full p-2 border rounded text-sm"
            value={soilParams.ph_level}
            onChange={e => setSoilParams({...soilParams, ph_level: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Nitrogen (kg/ha)</label>
          <input 
            type="number"
            className="w-full p-2 border rounded text-sm"
            value={soilParams.nitrogen}
            onChange={e => setSoilParams({...soilParams, nitrogen: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Phosphorus (kg/ha)</label>
          <input 
            type="number"
            className="w-full p-2 border rounded text-sm"
            value={soilParams.phosphorus}
            onChange={e => setSoilParams({...soilParams, phosphorus: parseFloat(e.target.value)})}
          />
        </div>
      </div>

      <button 
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors mb-4 font-medium"
      >
        {loading ? 'Analyzing Soil...' : 'Get Recommendations'}
      </button>

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Health Status */}
          <div className={`p-3 rounded-lg border ${result.soil_health_status === 'Healthy' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <p className="text-sm font-bold flex items-center gap-2">
              Soil Status: <span className={result.soil_health_status === 'Healthy' ? 'text-green-700' : 'text-yellow-700'}>{result.soil_health_status}</span>
            </p>
            {result.amendment_suggestions.length > 0 && (
              <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
                {result.amendment_suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-2">Recommended Crops</h4>
            <div className="space-y-3">
              {result.recommended_crops.map((crop, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-blue-800">{crop.crop_name}</h5>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                      {crop.suitability_score}% Match
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold">Yield:</span> {crop.expected_yield_per_acre} Qtl/acre
                    </div>
                    <div>
                      <span className="font-semibold">Fertilizer:</span> {crop.fertilizer_plan}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 italic">
                    <AlertTriangle size={12} className="inline mr-1 text-orange-500" />
                    Risks: {crop.risk_factors.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilRecommendationWidget;
