import React from 'react';
import { Award, Star, TrendingUp, ShieldCheck, Leaf, Zap } from 'lucide-react';

const GamificationWidget = () => {
  const badges = [
    { id: 1, name: "Early Adopter", icon: <Zap size={16} />, color: "bg-yellow-100 text-yellow-700" },
    { id: 2, name: "Sustainable Hero", icon: <Leaf size={16} />, color: "bg-green-100 text-green-700" },
    { id: 3, name: "Top Seller", icon: <TrendingUp size={16} />, color: "bg-blue-100 text-blue-700" },
    { id: 4, name: "Verified Farmer", icon: <ShieldCheck size={16} />, color: "bg-purple-100 text-purple-700" }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="text-orange-500" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Farmer Reputation</h2>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
          Level 5
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold text-gray-600">XP Progress</span>
          <span className="font-bold text-orange-600">2,450 / 3,000 XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">550 XP to reach "Master Cultivator"</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">98%</div>
          <div className="text-xs text-gray-500 font-medium">Trust Score</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">12</div>
          <div className="text-xs text-gray-500 font-medium">Contracts</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">450</div>
          <div className="text-xs text-gray-500 font-medium">Carbon Pts</div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Star size={14} className="text-yellow-500" /> Earned Badges
        </h3>
        <div className="flex flex-wrap gap-2">
          {badges.map(badge => (
            <div key={badge.id} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${badge.color}`}>
              {badge.icon}
              {badge.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationWidget;
