import React, { useState } from 'react';
import axios from 'axios';
import { Sprout, CloudRain, Droplets } from 'lucide-react';

const YieldForecastWidget = () => {
  const [inputs, setInputs] = useState({
    crop: 'Soybean',
    acreage: 1000,
    state: 'Madhya Pradesh',
    rainfall_mm: 900,
    soil_nitrogen: 50
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/predict/yield', inputs);
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Sprout className="text-green-600" /> AI Yield Forecaster
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500">Crop</label>
          <select 
            className="w-full p-2 border rounded"
            value={inputs.crop}
            onChange={e => setInputs({...inputs, crop: e.target.value})}
          >
            <option>Soybean</option>
            <option>Groundnut</option>
            <option>Mustard</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Rainfall (mm)</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded"
            value={inputs.rainfall_mm}
            onChange={e => setInputs({...inputs, rainfall_mm: parseFloat(e.target.value)})}
          />
        </div>
      </div>

      <button 
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors mb-4"
      >
        {loading ? 'Analyzing...' : 'Run Simulation'}
      </button>

      {prediction && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-gray-600">Predicted Yield</p>
              <p className="text-2xl font-bold text-green-800">{prediction.predicted_yield_quintals} Qtl</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="font-bold text-green-600">{(prediction.confidence_score * 100).toFixed(0)}%</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-500 uppercase">Impact Factors</p>
            {Object.entries(prediction.factors).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs">
                <span>{key}</span>
                <span className="font-mono">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YieldForecastWidget;
