import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area 
} from 'recharts';
import { TrendingUp, Calendar, BarChart2, Volume2, StopCircle } from 'lucide-react';

const ProductionAnalytics = ({ selectedState, selectedDistrict, selectedCrop }) => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCrop) return;
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/geo/analytics/production/${selectedCrop}`);
        // Convert Yield from kg/ha to kg/acre
        const convertedData = res.data.map(item => ({
          ...item,
          yield: Math.round(item.yield / 2.47)
        }));
        setData(convertedData);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedCrop, selectedState, selectedDistrict]);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (data.length === 0) return;

    const avgProduction = (data.reduce((acc, curr) => acc + curr.production, 0) / (data.length || 1)).toFixed(1);
    const avgYield = (data.reduce((acc, curr) => acc + curr.yield, 0) / (data.length || 1)).toFixed(0);
    const forecast = (data.length > 0 ? data[data.length-1].production * 1.05 : 0).toFixed(1);

    const textToSpeak = t('production_summary_speech', {
      crop: t(selectedCrop),
      production: avgProduction,
      yield: avgYield,
      forecast: forecast
    });

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Voice selection logic
    const voices = window.speechSynthesis.getVoices();
    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'pa': 'pa-IN',
      'ur': 'ur-IN',
      'or': 'or-IN',
      'ml': 'ml-IN',
      'bn': 'bn-IN',
      'as': 'as-IN'
    };
    
    const targetLang = langMap[i18n.language] || 'en-US';
    let voice = voices.find(v => v.lang === targetLang);
    if (!voice) {
        voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    }
    
    if (voice) utterance.voice = voice;
    utterance.lang = targetLang;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-purple-600" /> {t('Yield & Production Cycle Analysis')}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSpeak}
            className={`p-2 rounded-full transition-colors ${isSpeaking ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
            title={t('read_aloud')}
          >
            {isSpeaking ? <StopCircle size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {t(selectedState)} &gt; {t(selectedDistrict)} &gt; {t(selectedCrop)}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400">Loading Analytics...</div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" scale="point" padding={{ left: 30, right: 30 }} />
              <YAxis yAxisId="left" orientation="left" label={{ value: 'Production (Lakh Tonnes)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#8884d8' } }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Yield (kg/acre)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#82ca9d' } }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="production" name="Production Volume" fill="url(#colorProd)" stroke="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="yield" name="Yield Efficiency" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Production</p>
          <p className="font-bold text-purple-700 text-lg">
            {(data.reduce((acc, curr) => acc + curr.production, 0) / (data.length || 1)).toFixed(1)} <span className="text-xs font-normal">Lakh Tonnes</span>
          </p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Yield</p>
          <p className="font-bold text-green-700 text-lg">
            {(data.reduce((acc, curr) => acc + curr.yield, 0) / (data.length || 1)).toFixed(0)} <span className="text-xs font-normal">kg/acre</span>
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Forecast (2024)</p>
          <p className="font-bold text-blue-700 text-lg">
            {(data.length > 0 ? data[data.length-1].production * 1.05 : 0).toFixed(1)} <span className="text-xs font-normal">Lakh Tonnes</span>
          </p>
        </div>
      </div>
      
      <div className="mt-2 text-right">
         <span className="text-[10px] text-gray-400 italic">Source: Directorate of Oilseeds Development (Simulated)</span>
      </div>
    </div>
  );
};

export default ProductionAnalytics;
