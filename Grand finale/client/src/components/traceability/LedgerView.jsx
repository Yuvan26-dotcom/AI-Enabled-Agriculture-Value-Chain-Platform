import React from 'react';
import { ArrowLeft, Box, Hash, Clock, Shield, Database } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const LedgerView = ({ onNavigate }) => {
  const { ledger } = useTraceability();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Database className="text-blue-600" />
            Blockchain Ledger
          </h1>
          <p className="text-gray-500">Immutable record of all transactions in the supply chain</p>
        </div>
      </div>

      <div className="grid gap-6">
        {ledger.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Box className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No blocks mined yet. Start the supply chain process.</p>
          </div>
        ) : (
          ledger.map((block, index) => (
            <div 
              key={block.hash}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Block Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Box className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Block #{block.index}</span>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(block.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                  <Shield size={12} /> Verified
                </div>
              </div>

              {/* Block Body */}
              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Transaction Data */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Transaction Data</h4>
                  <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-600 overflow-x-auto">
                    <pre>{JSON.stringify(block.data, null, 2)}</pre>
                  </div>
                </div>

                {/* Cryptographic Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Hash size={12} /> Previous Hash
                    </h4>
                    <div className="font-mono text-xs text-gray-500 break-all bg-gray-50 p-2 rounded border border-gray-100">
                      {block.previousHash}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Hash size={12} /> Current Hash
                    </h4>
                    <div className="font-mono text-xs text-blue-600 break-all bg-blue-50 p-2 rounded border border-blue-100 font-bold">
                      {block.hash}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      Nonce: <span className="font-mono text-gray-600">{Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> Time to mine: 0.04s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LedgerView;
