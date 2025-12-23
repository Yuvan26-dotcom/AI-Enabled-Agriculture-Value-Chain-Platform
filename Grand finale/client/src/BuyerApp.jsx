import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ShoppingCart, Search, Truck, Wallet, LogOut, User, ShieldCheck } from 'lucide-react';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import MyBids from './components/buyer/MyBids';
import GlobalSourcing from './components/buyer/GlobalSourcing';
import BuyerLogistics from './components/buyer/BuyerLogistics';
import TraceabilityExplorer from './components/TraceabilityExplorer';

const BuyerApp = ({ onLogout, user }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Buyer Header */}
      <header className="bg-green-800 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-full">
              <span className="text-green-800 font-bold text-xl">OilSeeds.AI</span>
            </div>
            <span className="text-xs bg-green-600 px-2 py-1 rounded border border-green-500">Corporate Procurement</span>
          </div>
          
          <div className="flex gap-4 items-center">
            <select 
                onChange={(e) => changeLanguage(e.target.value)} 
                className="bg-green-900 text-white text-sm rounded px-2 py-1 border-none outline-none cursor-pointer hover:bg-green-700"
                defaultValue={i18n.language}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold">{user?.name || 'Global Oils Ltd.'}</p>
              <p className="text-xs text-green-200">Verified Buyer (Tier 1)</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-400">
              <User size={20} />
            </div>
            <button 
              onClick={onLogout}
              className="ml-2 px-3 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 flex items-center gap-1 text-sm"
              title="Switch Role"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:bg-green-50'}`}
          >
            <LayoutDashboard size={20} /> Procurement Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('bids')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap ${activeTab === 'bids' ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:bg-green-50'}`}
          >
            <ShoppingCart size={20} /> My Bids
          </button>
          <button 
            onClick={() => setActiveTab('sourcing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap ${activeTab === 'sourcing' ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:bg-green-50'}`}
          >
            <Search size={20} /> Global Sourcing
          </button>
          <button 
            onClick={() => setActiveTab('logistics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap ${activeTab === 'logistics' ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:bg-green-50'}`}
          >
            <Truck size={20} /> Logistics
          </button>
          <button 
            onClick={() => setActiveTab('traceability')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap ${activeTab === 'traceability' ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:bg-green-50'}`}
          >
            <ShieldCheck size={20} /> Traceability
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <BuyerDashboard />}
        {activeTab === 'bids' && <MyBids />}
        {activeTab === 'sourcing' && <GlobalSourcing />}
        {activeTab === 'logistics' && <BuyerLogistics />}
        {activeTab === 'traceability' && <TraceabilityExplorer />}
      </main>
    </div>
  );
};

export default BuyerApp;
