import React from 'react';
import { TrendingUp, Users, Package, AlertCircle, MapPin, ArrowRight, Truck, Wallet } from 'lucide-react';

const BuyerDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Active Bids</p>
              <h3 className="text-2xl font-bold text-blue-900">12</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Package size={20} />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
            <TrendingUp size={12} /> +2 filled today
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Total Volume</p>
              <h3 className="text-2xl font-bold text-blue-900">4,500 Qtl</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Target: 10,000 Qtl</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Pending Delivery</p>
              <h3 className="text-2xl font-bold text-orange-700">850 Qtl</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Truck size={20} />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2 font-medium">3 trucks in transit</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Wallet Balance</p>
              <h3 className="text-2xl font-bold text-gray-800">₹ 1.2 Cr</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Escrow: ₹ 45L</p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Market Heatmap */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} /> Live Procurement Heatmap
            </h3>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <option>Soybean</option>
              <option>Mustard</option>
              <option>Groundnut</option>
            </select>
          </div>
          
          {/* Placeholder Map */}
          <div className="bg-blue-50 rounded-xl h-80 flex items-center justify-center relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/India_location_map.svg/800px-India_location_map.svg.png')] bg-center bg-no-repeat bg-contain"></div>
            <div className="text-center z-10">
              <p className="text-blue-800 font-bold text-lg">Interactive Supply Map</p>
              <p className="text-sm text-blue-600">Click to explore high-yield districts</p>
            </div>
            
            {/* Hotspots */}
            <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            
            <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-green-500 rounded-full animate-ping delay-75"></div>
            <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Alerts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-between items-center group">
                Create New Buy Order
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex justify-between items-center">
                Verify eNWR Certificate
                <Package size={18} />
              </button>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
              <AlertCircle size={18} /> Market Alerts
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 text-sm">
                <p className="font-bold text-gray-800">Price Spike in MP</p>
                <p className="text-gray-500 text-xs mt-1">Soybean prices up by 4% in Indore Mandi due to rain forecast.</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 text-sm">
                <p className="font-bold text-gray-800">New Harvest Arrival</p>
                <p className="text-gray-500 text-xs mt-1">High quality Mustard arriving in Rajasthan (Alwar).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
