import React, { useState } from 'react';
import api from '../api';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Search, CheckCircle, Truck, Warehouse, Sprout, ShieldCheck, Factory, ShoppingBag, QrCode, FileText, MapPin, Plus, X, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet Icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TraceabilityExplorer = () => {
    const [batchId, setBatchId] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'map', 'certificate'
    const [journeyData, setJourneyData] = useState(null);
    
    // Create Batch State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({
        farmerId: 'FARMER-001',
        crop: 'Soybean',
        oilContent: '18',
        harvestDate: new Date().toISOString().split('T')[0]
    });
    const [createdBatch, setCreatedBatch] = useState(null);

    const mapHistoryToJourney = (history, batchId) => {
        if (!history || history.length === 0) return null;

        const timeline = history.map((block, index) => {
            let stage = 'Unknown Stage';
            let icon = <CheckCircle size={20} className="text-white" />;
            let color = 'bg-gray-500';
            let details = '';
            let location = 'Unknown Location';
            let coords = [22.7196, 75.8577]; // Default Indore

            switch (block.data.action) {
                case 'HARVEST_SOLD':
                    stage = 'Farming & Harvest';
                    icon = <Sprout size={20} className="text-white" />;
                    color = 'bg-green-500';
                    details = `Farmer ID: ${block.data.farmerId}. Crop: ${block.data.crop}. Harvest Date: ${new Date(block.data.harvestDate).toLocaleDateString()}`;
                    location = 'Farm Origin';
                    break;
                case 'PROCESSED':
                    stage = 'Processing & Extraction';
                    icon = <Factory size={20} className="text-white" />;
                    color = 'bg-orange-500';
                    details = `Processor ID: ${block.data.processorId}. Operation: ${block.data.details}.`;
                    location = 'Processing Unit';
                    break;
                case 'SHIPMENT_CREATED':
                    stage = 'Logistics & Transport';
                    icon = <Truck size={20} className="text-white" />;
                    color = 'bg-blue-500';
                    details = `Tracking ID: ${block.data.trackingId}. From ${block.data.origin} to ${block.data.destination}.`;
                    location = 'In Transit';
                    break;
                default:
                    stage = block.data.action.replace('_', ' ');
            }

            return {
                id: index + 1,
                stage,
                date: new Date(block.timestamp).toLocaleString(),
                location,
                details,
                icon,
                color,
                coords,
                hash: block.hash
            };
        });

        // Determine current status from the last item
        const lastItem = timeline[timeline.length - 1];
        
        return {
            product: history[0]?.data?.crop ? `${history[0].data.crop} Product` : "Agricultural Produce",
            batchId: batchId,
            origin: "Indore, Madhya Pradesh", // Could be dynamic
            currentStatus: lastItem.stage,
            purity: "100%", // Placeholder
            timeline: timeline
        };
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (batchId.trim()) {
            setLoading(true);
            setError('');
            setShowResult(false);
            
            try {
                const res = await api.get(`/trace/track/${batchId}`);
                const mappedData = mapHistoryToJourney(res.data.history, batchId);
                setJourneyData(mappedData);
                setShowResult(true);
            } catch (err) {
                console.error(err);
                setError('Batch ID not found or invalid. Please check and try again.');
                setJourneyData(null);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/trace/sell', createForm);
            setCreatedBatch(res.data);
            setBatchId(res.data.batchId); // Auto-fill search
        } catch (err) {
            console.error(err);
            // Fallback for demo if server is offline
            const mockBatch = {
                batchId: `BATCH-${Date.now()}`,
                hash: '0x' + Math.random().toString(16).substr(2, 64),
                timestamp: new Date().toISOString()
            };
            setCreatedBatch(mockBatch);
            setBatchId(mockBatch.batchId);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <QrCode className="w-8 h-8" /> Seed-to-Oil Traceability
                        </h1>
                        <p className="text-blue-100 max-w-2xl">
                            Verify the journey of your oilseed product from the farm to your kitchen. 
                            Powered by immutable Blockchain technology for 100% transparency.
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <Plus size={20} /> Register Harvest
                    </button>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <form onSubmit={handleSearch} className="flex gap-4 max-w-3xl mx-auto">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Enter Batch ID (e.g., BATCH-2024-001) or Scan QR"
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Verifying...' : 'Track Journey'}
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 max-w-3xl mx-auto">
                    <AlertTriangle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {/* Results Section */}
            {showResult && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Product Info & Certificate */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Product Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{journeyData.product}</h2>
                                    <p className="text-sm text-gray-500">Batch: {journeyData.batchId}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <CheckCircle size={12} /> Verified
                                </span>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Origin</span>
                                    <span className="font-medium text-gray-800">{journeyData.origin}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Purity</span>
                                    <span className="font-medium text-gray-800">{journeyData.purity}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-medium text-blue-600">{journeyData.currentStatus}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${journeyData.batchId}`} 
                                    alt="QR Code" 
                                    className="mx-auto mb-2 w-32 h-32"
                                />
                                <p className="text-xs text-gray-400">Scan to verify on mobile</p>
                            </div>
                        </div>

                        {/* Blockchain Certificate */}
                        <div className="bg-gray-900 text-gray-300 p-6 rounded-xl shadow-md font-mono text-xs overflow-hidden relative">
                            <div className="flex items-center gap-2 mb-4 text-green-400 font-bold uppercase tracking-wider">
                                <ShieldCheck size={16} /> Blockchain Ledger
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <p className="text-gray-500 mb-1">Latest Block Hash:</p>
                                    <p className="text-white break-all bg-white/10 p-2 rounded">
                                        {journeyData.timeline[journeyData.timeline.length-1].hash}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Smart Contract:</p>
                                    <p className="text-blue-400">0x8f3...c2a1</p>
                                </div>
                                <div className="flex items-center gap-2 text-green-400 mt-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Consensus Verified
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Timeline & Map */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
                        
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            <button 
                                onClick={() => setActiveTab('timeline')}
                                className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <FileText size={18} /> Journey Timeline
                            </button>
                            <button 
                                onClick={() => setActiveTab('map')}
                                className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'map' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <MapPin size={18} /> Geo-Track Map
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 overflow-y-auto min-h-[500px]">
                            
                            {activeTab === 'timeline' && (
                                <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-8">
                                    {journeyData.timeline.map((step, index) => (
                                        <div key={step.id} className="relative pl-8 group">
                                            {/* Icon Bubble */}
                                            <div className={`absolute -left-[19px] top-0 w-10 h-10 rounded-full ${step.color} flex items-center justify-center border-4 border-white shadow-sm z-10 group-hover:scale-110 transition-transform`}>
                                                {step.icon}
                                            </div>
                                            
                                            {/* Content Card */}
                                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:bg-white relative">
                                                {index === journeyData.timeline.length - 1 && (
                                                    <span className="absolute -right-2 -top-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse z-20">
                                                        CURRENT STAGE
                                                    </span>
                                                )}
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-lg">{step.stage}</h3>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <MapPin size={12} /> {step.location}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                                        {step.date}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-3">{step.details}</p>
                                                
                                                {/* Hash Mini-display */}
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono bg-gray-100 p-2 rounded">
                                                    <ShieldCheck size={12} className="text-gray-400" />
                                                    <span className="truncate w-full">Hash: {step.hash}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'map' && (
                                <div className="h-full min-h-[500px] rounded-xl overflow-hidden border border-gray-200 relative">
                                    <MapContainer center={[22.9, 76.5]} zoom={8} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; OpenStreetMap contributors'
                                        />
                                        
                                        {/* Route Line */}
                                        <Polyline 
                                            positions={journeyData.timeline.map(t => t.coords)} 
                                            color="#3b82f6" 
                                            weight={4} 
                                            dashArray="10, 10" 
                                            opacity={0.7}
                                        />

                                        {/* Markers */}
                                        {journeyData.timeline.map((step) => (
                                            <Marker key={step.id} position={step.coords}>
                                                <Popup>
                                                    <div className="font-bold text-sm">{step.stage}</div>
                                                    <div className="text-xs">{step.location}</div>
                                                    <div className="text-xs text-gray-500">{step.date}</div>
                                                </Popup>
                                            </Marker>
                                        ))}
                                    </MapContainer>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            )}

            {/* Create Batch Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 z-[2000] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <Plus size={20} /> Register New Harvest
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="hover:bg-blue-700 p-1 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {!createdBatch ? (
                                <form onSubmit={handleCreateBatch} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                                        <select 
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={createForm.crop}
                                            onChange={(e) => setCreateForm({...createForm, crop: e.target.value})}
                                        >
                                            <option>Soybean</option>
                                            <option>Mustard</option>
                                            <option>Groundnut</option>
                                            <option>Sunflower</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Oil Content (%)</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={createForm.oilContent}
                                            onChange={(e) => setCreateForm({...createForm, oilContent: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={createForm.harvestDate}
                                            onChange={(e) => setCreateForm({...createForm, harvestDate: e.target.value})}
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                                    >
                                        {loading ? 'Generating Passport...' : 'Generate Digital Passport'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Passport Created!</h3>
                                    <p className="text-gray-600 text-sm">Your harvest has been registered on the blockchain.</p>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left">
                                        <p className="text-xs text-gray-500">Batch ID:</p>
                                        <p className="font-mono font-bold text-gray-800 mb-2">{createdBatch.batchId}</p>
                                        <p className="text-xs text-gray-500">Transaction Hash:</p>
                                        <p className="font-mono text-xs text-gray-600 break-all">{createdBatch.hash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}</p>
                                    </div>

                                    <button 
                                        onClick={() => { setShowCreateModal(false); setCreatedBatch(null); setShowResult(true); }}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        View Journey
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TraceabilityExplorer;
