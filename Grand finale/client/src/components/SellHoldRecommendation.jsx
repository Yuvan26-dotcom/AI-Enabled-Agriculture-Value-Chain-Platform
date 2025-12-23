import React from 'react';
import { Gauge, AlertTriangle, Info } from 'lucide-react';

const SellHoldRecommendation = ({ onNavigate }) => {
  // Mock Sentiment Score (0-100)
  const sentimentScore = 85; // Bullish
  const sentimentLabel = "Bullish / High Demand";
  const sentimentColor = "text-green-400";

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2">
            <Gauge size={14} /> Market Sentiment Index
          </h3>
          <h2 className={`text-2xl font-extrabold mt-1 ${sentimentColor}`}>{sentimentLabel}</h2>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black">{sentimentScore}</span>
          <span className="text-sm text-slate-400">/100</span>
        </div>
      </div>

      {/* Speedometer Visual (CSS Only) */}
      <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden mb-4">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
          style={{ width: `${sentimentScore}%` }}
        ></div>
      </div>

      <p className="text-slate-300 text-sm mb-6 leading-relaxed">
        AI analysis of <strong>50+ data points</strong> (Weather, Global Prices, Mandi Arrivals) indicates strong upward pressure on prices.
      </p>

      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex gap-3 mb-4">
        <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-slate-400">
          <strong>Insight:</strong> Delayed monsoon in key growing regions may impact supply, potentially driving prices up by 5-8% next week.
        </p>
      </div>

      {/* Disclaimer Footer */}
      <div className="border-t border-slate-700 pt-3 mt-2 flex items-start gap-2 text-[10px] text-slate-500">
        <AlertTriangle size={12} className="shrink-0 mt-0.5" />
        <p>
          AI insights are for reference only. Agricultural markets are volatile and subject to unforeseen risks. 
          Biometrix does not guarantee profits and is not liable for financial losses.
        </p>
      </div>
    </div>
  );
};

export default SellHoldRecommendation;
