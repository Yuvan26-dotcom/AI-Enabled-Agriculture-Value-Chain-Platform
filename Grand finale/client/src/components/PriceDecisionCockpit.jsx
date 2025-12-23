import React, { useState, useMemo } from 'react';
import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Lock, IndianRupee, Users, ArrowRight, Activity, ChevronDown 
} from 'lucide-react';
import { oilseedMarketData } from '../data/market_data';

const PriceDecisionCockpit = ({ onNavigate }) => {
  const [selectedCrop, setSelectedCrop] = useState('Soybean');
  
  const marketData = useMemo(() => oilseedMarketData[selectedCrop], [selectedCrop]);
  
  // Extract data from the selected crop
  const data = marketData.history;
  const currentPrice = marketData.currentPrice;
  const msp = marketData.msp;
  const activeBuyers = marketData.buyers;

  // Calculate Forecast Logic
  const forecastData = data.filter(d => d.type === 'Forecast');
  const lastForecastPrice = forecastData[forecastData.length - 1]?.price || currentPrice;
  
  const isPriceDropping = lastForecastPrice < currentPrice;
  const isDistress = currentPrice < msp;
  const priceDiff = Math.abs(lastForecastPrice - currentPrice);

  // Determine Recommendation
  let recommendation = 'HOLD';
  let recommendationColor = 'green';
  let recommendationText = 'Market is Rising';
  let recommendationSubtext = `Hold your stock. Prices are expected to rise by ₹${priceDiff}/Qtl.`;

  if (isDistress) {
    recommendation = 'DISTRESS';
    recommendationColor = 'red';
    recommendationText = 'Price Below MSP';
    recommendationSubtext = `Current price is ₹${msp - currentPrice} below MSP. Consider government procurement centers.`;
  } else if (isPriceDropping) {
    recommendation = 'SELL';
    recommendationColor = 'orange'; // Changed to orange/red for sell warning
    recommendationText = 'Market is Falling';
    recommendationSubtext = `Lock your price today to save ₹${priceDiff}/Qtl before rates drop further.`;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Row: Volatility Card & Smart Decision Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Price Volatility Card (The Core) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Activity className="text-blue-600" /> Price Volatility Monitor
              </h2>
              <div className="relative mt-1 inline-block">
                <select 
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 font-bold"
                >
                  {Object.keys(oilseedMarketData).map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">Current Spot Price</p>
              <p className="text-2xl font-bold text-gray-900">₹{currentPrice.toLocaleString()}<span className="text-sm font-normal text-gray-500">/Qtl</span></p>
              <p className="text-xs text-gray-500 mt-1">MSP: <span className="font-bold text-green-700">₹{msp}</span></p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPriceDropping ? "#ef4444" : "#22c55e"} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={isPriceDropping ? "#ef4444" : "#22c55e"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <ReferenceLine x="Today" stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'TODAY', position: 'insideTop', fill: '#3b82f6', fontSize: 10 }} />
                
                {/* MSP Line */}
                <ReferenceLine y={msp} stroke="#16a34a" strokeDasharray="5 5" label={{ value: 'MSP', position: 'insideLeft', fill: '#16a34a', fontSize: 10, fontWeight: 'bold' }} />

                {/* Actual Price Line */}
                <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                
                {/* Forecast Area/Line */}
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPriceDropping ? "#ef4444" : "#22c55e"} 
                  fill="url(#colorForecast)" 
                  strokeWidth={3} 
                  strokeDasharray="5 5" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Volatility Gap Alert */}
          {isPriceDropping && !isDistress && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-800">Volatility Alert: Price Drop Forecast</p>
                <p className="text-xs text-red-700">
                  Projected drop of <span className="font-bold">₹{priceDiff}</span> in next 15 days. Hedging is recommended.
                </p>
              </div>
            </div>
          )}
          
          {isDistress && (
             <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-orange-800">Distress Alert: Price Below MSP</p>
                <p className="text-xs text-orange-700">
                  Market price is below MSP. Do not sell in open market if possible.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Smart Decision Widget (Traffic Light) */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">Smart Decision</h3>
          
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
            <div className={`relative w-32 h-32 rounded-full flex items-center justify-center border-8 shadow-inner ${
              recommendation === 'HOLD' 
                ? 'bg-green-50 border-green-500 text-green-600' 
                : recommendation === 'SELL'
                  ? 'bg-red-50 border-red-500 text-red-600'
                  : 'bg-orange-50 border-orange-500 text-orange-600'
            }`}>
              <div className="text-center">
                <span className="block text-2xl font-black tracking-tighter">
                  {recommendation}
                </span>
                <span className="text-xs font-bold uppercase opacity-80">Signal</span>
              </div>
              
              {/* Traffic Light Glow Effect */}
              <div className={`absolute inset-0 rounded-full opacity-20 animate-pulse ${
                 recommendation === 'HOLD' ? 'bg-green-400' : recommendation === 'SELL' ? 'bg-red-400' : 'bg-orange-400'
              }`}></div>
            </div>

            <div className={`p-4 rounded-lg ${
               recommendation === 'HOLD' ? 'bg-green-50 text-green-800' : recommendation === 'SELL' ? 'bg-red-50 text-red-800' : 'bg-orange-50 text-orange-800'
            }`}>
              <p className="font-bold text-lg mb-1">
                {recommendationText}
              </p>
              <p className="text-sm opacity-90">
                {recommendationSubtext}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Local Demand & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. Local Demand Ticker */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-600" /> Local Demand Ticker
            </h3>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              Live Updates
            </span>
          </div>
          
          {activeBuyers.length > 0 ? (
            <div className="space-y-3">
              {activeBuyers.map(buyer => {
                const isFPO = buyer.type === 'FPO';
                const percentFilled = isFPO ? Math.round((buyer.qty_filled / buyer.qty_total) * 100) : 0;
                const remaining = isFPO ? buyer.qty_total - buyer.qty_filled : 0;

                return (
                  <div 
                    key={buyer.id} 
                    onClick={() => onNavigate('contracts', { 
                      crop: selectedCrop, 
                      suggestedPrice: buyer.price, 
                      buyerId: buyer.id,
                      buyerName: buyer.name,
                      isFPO: isFPO
                    })}
                    className="cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${isFPO ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                          {buyer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 flex items-center gap-2">
                            {buyer.name}
                            {!isFPO && <span className="bg-orange-100 text-orange-800 text-[10px] px-1.5 py-0.5 rounded border border-orange-200">Micro-Bid</span>}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            {buyer.location} • {isFPO ? `For ${buyer.buyer_name}` : 'Local Trader'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{buyer.price}/Qtl</p>
                        <p className="text-xs text-gray-500">{buyer.deadline}</p>
                      </div>
                    </div>

                    {isFPO ? (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-blue-700">
                            {percentFilled}% Filled ({buyer.qty_filled}/{buyer.qty_total} Qtl)
                          </span>
                          <span className="text-red-600 font-bold">
                            Need {remaining} Qtl more
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${percentFilled}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Join this bulk order to get premium rates.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                        <span className="text-xs text-gray-600">Wants <strong>{buyer.qty_total} Qtl</strong> immediately.</span>
                        <span className="text-xs text-blue-600 font-bold hover:underline">Sell Now &rarr;</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No active buyers found for {selectedCrop} in your region.</p>
            </div>
          )}
          
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">High local demand indicates lower liquidity risk.</p>
          </div>
        </div>

        {/* 4. Quick Actions (Financial Only) */}
        <div className="bg-blue-900 text-white p-6 rounded-xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">Financial Actions</h3>
            <p className="text-blue-200 text-sm mb-6">Manage your risk and capital.</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate('contracts')}
                className="w-full bg-white text-blue-900 py-3 px-4 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center justify-between group"
              >
                <span className="flex items-center gap-2"><Lock size={18} /> Lock Price (Hedge)</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => onNavigate('credit')}
                className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center justify-between border border-blue-500 group"
              >
                <span className="flex items-center gap-2"><IndianRupee size={18} /> Get Loan (Credit)</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-blue-800">
            <p className="text-xs text-blue-300 text-center">
              Biometrix Financial Services • Regulated by RBI/SEBI
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PriceDecisionCockpit;
