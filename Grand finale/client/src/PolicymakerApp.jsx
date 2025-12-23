import React from 'react';
import PolicymakerDashboard from './components/PolicymakerDashboard';
import { LogOut } from 'lucide-react';

const PolicymakerApp = ({ onLogout, user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="font-bold text-xl text-gray-800">Admin <span className="text-green-600">Portal</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Ministry of Agriculture'}</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <PolicymakerDashboard />
      </main>
    </div>
  );
};

export default PolicymakerApp;
