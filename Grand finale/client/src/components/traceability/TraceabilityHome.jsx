import React from 'react';
import { Sprout, Tractor, Users, Warehouse, Factory, ShoppingBag, QrCode, ShieldCheck, Mic, PlayCircle } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const RoleCard = ({ title, icon: Icon, color, onClick, description }) => (
  <button 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 ${color} text-left group w-full h-full flex flex-col`}
  >
    <div className={`p-3 rounded-full w-fit mb-4 ${color.replace('border-', 'bg-').replace('500', '100')} group-hover:scale-110 transition-transform`}>
      <Icon size={32} className={color.replace('border-', 'text-')} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm flex-grow">{description}</p>
    <div className="mt-4 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
      Enter Portal <PlayCircle size={16} className="ml-1" />
    </div>
  </button>
);

const TraceabilityHome = ({ onNavigate }) => {
  const { resetDemo } = useTraceability();

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="text-center py-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h2 className="text-4xl font-bold mb-4 relative z-10">End-to-End Value Chain Traceability</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8 relative z-10">
          Experience the journey of oilseeds from soil to shelf, secured by blockchain technology.
          Select a stakeholder role to begin.
        </p>
        
        <div className="flex justify-center gap-4 relative z-10">
          <button 
            onClick={() => {
              resetDemo();
              onNavigate('consumer');
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <QrCode size={20} /> Trace Entire Journey
          </button>
          <button 
            onClick={() => speak("Welcome to the Oilseed Traceability System. Please select your role to proceed.")}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium backdrop-blur-sm flex items-center gap-2 transition-colors"
          >
            <Mic size={20} /> Voice Navigation
          </button>
        </div>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RoleCard 
          title="Seed Supplier" 
          icon={Sprout} 
          color="border-emerald-500" 
          description="Generate certified seed batches with genetic data and QR codes."
          onClick={() => onNavigate('seed')}
        />
        <RoleCard 
          title="Farmer" 
          icon={Tractor} 
          color="border-green-600" 
          description="Log sowing, inputs, and harvest data linked to land records."
          onClick={() => onNavigate('farm')}
        />
        <RoleCard 
          title="FPO Aggregator" 
          icon={Users} 
          color="border-blue-500" 
          description="Aggregate produce, perform quality grading, and create lots."
          onClick={() => onNavigate('fpo')}
        />
        <RoleCard 
          title="Warehouse & Logistics" 
          icon={Warehouse} 
          color="border-purple-500" 
          description="Track storage conditions and GPS-based transport movement."
          onClick={() => onNavigate('warehouse')}
        />
        <RoleCard 
          title="Processor" 
          icon={Factory} 
          color="border-orange-500" 
          description="Record processing, oil extraction, and lab reports."
          onClick={() => onNavigate('processor')}
        />
        <RoleCard 
          title="Retailer" 
          icon={ShoppingBag} 
          color="border-red-500" 
          description="Verify stock freshness and manage consumer sales."
          onClick={() => onNavigate('retailer')}
        />
        <RoleCard 
          title="Consumer View" 
          icon={QrCode} 
          color="border-teal-500" 
          description="Scan QR to view the complete product journey and score."
          onClick={() => onNavigate('consumer')}
        />
        <RoleCard 
          title="Policymaker" 
          icon={ShieldCheck} 
          color="border-indigo-600" 
          description="Monitor supply chain health, fraud alerts, and statistics."
          onClick={() => onNavigate('policymaker')}
        />
      </div>

      {/* Ledger Link */}
      <div className="text-center mt-8">
        <button 
          onClick={() => onNavigate('ledger')}
          className="text-slate-500 hover:text-slate-800 font-medium underline decoration-dotted underline-offset-4"
        >
          View Raw Blockchain Ledger
        </button>
      </div>
    </div>
  );
};

export default TraceabilityHome;
