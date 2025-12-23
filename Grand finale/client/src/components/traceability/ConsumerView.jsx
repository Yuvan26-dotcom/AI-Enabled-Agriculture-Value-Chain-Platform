import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Sprout, Truck, Factory, ShoppingBag, MapPin, Volume2, ShieldCheck, Leaf, Droplets } from 'lucide-react';
import { useTraceability } from './TraceabilityContext';

const ConsumerView = ({ onNavigate }) => {
  const { activeBatch } = useTraceability();
  const [scanned, setScanned] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Mock Data if flow wasn't completed
  const mockData = {
    seed: { variety: 'JS-9560', genetics: 'Non-GMO' },
    farm: { location: 'Indore, MP', farmer: 'Rajesh Kumar', harvestDate: '2024-11-15' },
    processor: { method: 'Cold Pressed', date: '2024-11-18' },
    retailer: { name: 'FreshMart', price: '₹185' }
  };

  const data = {
    seed: activeBatch.seedData || mockData.seed,
    farm: activeBatch.farmData || mockData.farm,
    processor: activeBatch.processorData || mockData.processor,
    retailer: activeBatch.retailerData || mockData.retailer
  };

  const handleScan = () => {
    setScanned(true);
    speakTraceability();
  };

  const speakTraceability = () => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    
    const text = `Hello! This bottle of premium soybean oil started its journey in Indore, Madhya Pradesh. 
    It was grown by farmer Rajesh Kumar using Non-GMO seeds. 
    After harvest on November 15th, it was aggregated by Samarth Kisan FPO. 
    It traveled 45 kilometers to Dewas, where it was cold-pressed at 42 degrees Celsius to retain nutrients. 
    It is now available at FreshMart, fully verified by blockchain. Enjoy your healthy meal!`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  if (!scanned) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-br from-teal-500 to-emerald-700 rounded-2xl shadow-2xl text-white p-8">
        <div className="bg-white p-4 rounded-2xl shadow-xl mb-8 animate-bounce">
          <QrCode size={120} className="text-teal-800" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Scan to Trace</h2>
        <p className="text-teal-100 text-center max-w-md mb-8">
          Discover the story behind your food. Verify authenticity, origin, and quality instantly.
        </p>
        <button 
          onClick={handleScan}
          className="bg-white text-teal-700 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-teal-50 transition-transform hover:scale-105"
        >
          Scan Product QR
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
      {/* Header Image */}
      <div className="h-64 bg-gray-200 relative">
        <img 
          src="https://images.unsplash.com/photo-1474979266404-7cadd259d366?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Farm" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <div className="flex justify-between items-end">
            <div>
              <span className="bg-green-500 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">100% ORGANIC</span>
              <h1 className="text-3xl font-bold">Premium Soy Oil</h1>
              <p className="text-gray-300 text-sm flex items-center gap-1">
                <MapPin size={14} /> Origin: Indore, Madhya Pradesh
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
              <img src="/logo.svg" className="w-8 h-8" alt="Logo" onError={(e) => e.target.style.display='none'} />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Seal */}
      <div className="bg-teal-50 p-4 flex items-center justify-between border-b border-teal-100">
        <div className="flex items-center gap-2 text-teal-800 font-bold">
          <ShieldCheck className="text-teal-600" />
          Verified by Blockchain
        </div>
        <button 
          onClick={speakTraceability}
          className={`p-2 rounded-full transition-colors ${playing ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 shadow-sm'}`}
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Timeline */}
      <div className="p-6 space-y-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-gray-200"></div>

        {/* Stage 1: Seed */}
        <div className="relative flex gap-4 animate-in slide-in-from-bottom-4 delay-100">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
            <Sprout size={14} className="text-emerald-600" />
          </div>
          <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm">Seed Sourcing</h3>
            <p className="text-xs text-gray-500 mb-2">Variety: {data.seed.variety}</p>
            <div className="flex gap-2">
              <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{data.seed.genetics}</span>
            </div>
          </div>
        </div>

        {/* Stage 2: Farm */}
        <div className="relative flex gap-4 animate-in slide-in-from-bottom-4 delay-200">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
            <Leaf size={14} className="text-green-600" />
          </div>
          <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm">Cultivation & Harvest</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh" alt="Farmer" />
              </div>
              <div>
                <p className="text-xs font-bold">Rajesh Kumar</p>
                <p className="text-[10px] text-gray-500">Farmer • Indore</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600">
              <div className="bg-gray-50 p-2 rounded">
                <span className="block font-bold text-gray-800">15 Nov</span>
                Harvest Date
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="block font-bold text-gray-800">Organic</span>
                Practice
              </div>
            </div>
          </div>
        </div>

        {/* Stage 3: Processing */}
        <div className="relative flex gap-4 animate-in slide-in-from-bottom-4 delay-300">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
            <Factory size={14} className="text-orange-600" />
          </div>
          <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm">Processing</h3>
            <p className="text-xs text-gray-500 mb-2">{data.processor.method}</p>
            <div className="flex items-center gap-2 text-[10px] text-green-600 bg-green-50 p-2 rounded">
              <CheckCircle size={12} /> Quality Passed (Grade A)
            </div>
          </div>
        </div>

        {/* Stage 4: Retail */}
        <div className="relative flex gap-4 animate-in slide-in-from-bottom-4 delay-400">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
            <ShoppingBag size={14} className="text-red-600" />
          </div>
          <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm">Retailer</h3>
            <p className="text-xs text-gray-500">{data.retailer.name}</p>
            <p className="text-xs text-gray-400">Shelf Life: 6 Months</p>
          </div>
        </div>
      </div>

      {/* Sustainability Score */}
      <div className="p-6 bg-gray-50 mt-4">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Leaf className="text-green-600" /> Sustainability Score
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="text-green-600 font-bold text-xl">A+</div>
            <div className="text-[10px] text-gray-500 uppercase mt-1">Carbon</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="text-blue-600 font-bold text-xl">Low</div>
            <div className="text-[10px] text-gray-500 uppercase mt-1">Water</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="text-purple-600 font-bold text-xl">45km</div>
            <div className="text-[10px] text-gray-500 uppercase mt-1">Miles</div>
          </div>
        </div>
      </div>

      <div className="p-6 pb-12">
        <button 
          onClick={() => onNavigate('ledger')}
          className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 text-sm"
        >
          View Technical Blockchain Ledger
        </button>
      </div>
    </div>
  );
};

export default ConsumerView;
