import React from 'react';
import { ArrowLeft, BarChart3, AlertTriangle, TrendingUp, Map, FileText } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const PolicymakerView = ({ onNavigate }) => {
  const { ledger } = useTraceability();

  // Mock Analytics derived from ledger
  const totalBatches = ledger.filter(b => b.data.stage === 'seed').length || 1;
  const activeFarmers = new Set(ledger.filter(b => b.data.stage === 'farm').map(b => b.data.farmerId)).size || 1;
  const totalVolume = 1500; // Mock tons
  const alerts = 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">National Oilseed Dashboard</h1>
            <p className="text-gray-500">Real-time supply chain monitoring for policymakers</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            System Settings
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Production</h3>
          <p className="text-2xl font-bold text-gray-900">{totalVolume} MT</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Map className="text-green-600" size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Active Farmers</h3>
          <p className="text-2xl font-bold text-gray-900">{activeFarmers * 1240}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <FileText className="text-purple-600" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">0%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Smart Contracts</h3>
          <p className="text-2xl font-bold text-gray-900">{totalBatches * 85}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">-2%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Anomalies Detected</h3>
          <p className="text-2xl font-bold text-gray-900">{alerts}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-6">Regional Production Heatmap</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            [Interactive Map Placeholder: Madhya Pradesh & Maharashtra Highlighting]
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-6">Supply Chain Efficiency</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Seed to Harvest</span>
                <span className="font-bold">95 Days</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[80%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Harvest to Processing</span>
                <span className="font-bold">3 Days</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[20%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Processing to Retail</span>
                <span className="font-bold">5 Days</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[30%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Recent Blockchain Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Block ID</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Stage</th>
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ledger.slice(-5).reverse().map((block) => (
                <tr key={block.hash} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-blue-600">#{block.index}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(block.timestamp).toLocaleTimeString()}</td>
                  <td className="px-6 py-4 capitalize">{block.data.stage}</td>
                  <td className="px-6 py-4">{block.data.actor || 'System'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
              {ledger.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PolicymakerView;
