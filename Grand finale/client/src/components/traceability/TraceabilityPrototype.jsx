import React, { useState } from 'react';
import { TraceabilityProvider } from './TraceabilityContext';
import TraceabilityHome from './TraceabilityHome';
import SeedStage from './SeedStage';
import FarmStage from './FarmStage';
import FPOStage from './FPOStage';
import WarehouseStage from './WarehouseStage';
import ProcessorStage from './ProcessorStage';
import RetailerStage from './RetailerStage';
import ConsumerView from './ConsumerView';
import LedgerView from './LedgerView';
import PolicymakerView from './PolicymakerView';
import TraceabilityExplorer from '../TraceabilityExplorer';
import { ArrowLeft, Home } from 'lucide-react';

const TraceabilityPrototype = ({ onExit }) => {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'home': return <TraceabilityHome onNavigate={setCurrentView} />;
      case 'seed': return <SeedStage onNavigate={setCurrentView} />;
      case 'farm': return <FarmStage onNavigate={setCurrentView} />;
      case 'fpo': return <FPOStage onNavigate={setCurrentView} />;
      case 'warehouse': return <WarehouseStage onNavigate={setCurrentView} />;
      case 'processor': return <ProcessorStage onNavigate={setCurrentView} />;
      case 'retailer': return <RetailerStage onNavigate={setCurrentView} />;
      case 'consumer': return <TraceabilityExplorer />;
      case 'ledger': return <LedgerView onNavigate={setCurrentView} />;
      case 'policymaker': return <PolicymakerView onNavigate={setCurrentView} />;
      default: return <TraceabilityHome onNavigate={setCurrentView} />;
    }
  };

  return (
    <TraceabilityProvider>
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Global Navigation Header for Prototype */}
        <div className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {currentView !== 'home' && (
              <button onClick={() => setCurrentView('home')} className="hover:bg-slate-700 p-2 rounded-full transition-colors">
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
              <span className="text-green-400">BlockChain</span> Traceability Prototype
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <Home size={18} /> Home
            </button>
            <button 
              onClick={onExit} 
              className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Exit Demo
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto p-4">
          {renderView()}
        </div>
      </div>
    </TraceabilityProvider>
  );
};

export default TraceabilityPrototype;
