import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, Map, Activity, FileText, Users, 
  ShieldCheck, Truck, UserPlus, IndianRupee
} from 'lucide-react';
import AnalyticsView from './AnalyticsView';
import LogisticsMap from './LogisticsMap';
import UserRegistration from './UserRegistration';
import MarketPriceManager from './MarketPriceManager';

const PolicymakerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data for High Level Stats
  const stats = [
    { title: "Total Oilseed Production", value: "24.5 M Tonnes", change: "+5.2%", icon: Activity, color: "text-green-600" },
    { title: "MSP Adherence Rate", value: "88%", change: "+2.1%", icon: ShieldCheck, color: "text-green-600" },
    { title: "Active Warehouses", value: "1,240", change: "92% Capacity", icon: Truck, color: "text-purple-600" },
    { title: "Registered Farmers", value: "4.2 M", change: "+120k this month", icon: Users, color: "text-orange-600" },
  ];

  const productionData = [
    { state: 'MP', soybean: 4500, groundnut: 1200, mustard: 3000 },
    { state: 'MH', soybean: 3800, groundnut: 1500, mustard: 800 },
    { state: 'RJ', soybean: 1200, groundnut: 2000, mustard: 4500 },
    { state: 'GJ', soybean: 800, groundnut: 3500, mustard: 1500 },
    { state: 'AP', soybean: 500, groundnut: 2800, mustard: 200 },
    { state: 'KA', soybean: 400, groundnut: 2500, mustard: 100 },
    { state: 'TN', soybean: 200, groundnut: 2200, mustard: 50 },
    { state: 'UP', soybean: 300, groundnut: 1000, mustard: 3500 },
    { state: 'PB', soybean: 100, groundnut: 500, mustard: 2000 },
    { state: 'HR', soybean: 150, groundnut: 400, mustard: 2500 },
    { state: 'WB', soybean: 200, groundnut: 800, mustard: 1500 },
    { state: 'OD', soybean: 100, groundnut: 900, mustard: 600 },
    { state: 'TS', soybean: 600, groundnut: 1800, mustard: 100 },
    { state: 'CH', soybean: 300, groundnut: 600, mustard: 400 },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 bg-gray-50 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            <span className="text-xs text-gray-400 ml-2">vs last year</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production by State */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">State-wise Production (000 Tonnes)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="soybean" fill="#8884d8" name="Soybean" />
                <Bar dataKey="groundnut" fill="#82ca9d" name="Groundnut" />
                <Bar dataKey="mustard" fill="#ffc658" name="Mustard" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Trends (Reusing AnalyticsView logic but simplified) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Price Stability Analysis</h3>
          <div className="h-80">
             <AnalyticsView initialCrop="Soybean" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogistics = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[600px]">
      <h3 className="text-lg font-bold text-gray-800 mb-4">National Logistics & Warehouse Map</h3>
      <LogisticsMap />
    </div>
  );

  const renderAdminTools = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UserRegistration />
      <MarketPriceManager />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">National Oilseed Mission Dashboard</h1>
          <p className="text-gray-500">AI-Driven Insights for Policy & Planning</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('logistics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'logistics' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Logistics Network
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'admin' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Admin Tools
          </button>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'logistics' && renderLogistics()}
      {activeTab === 'admin' && renderAdminTools()}
    </div>
  );
};

export default PolicymakerDashboard;
