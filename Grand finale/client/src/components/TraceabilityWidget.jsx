import React, { useState } from 'react';
import axios from 'axios';
import { QrCode, Search, Package, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const TraceabilityWidget = () => {
    const [activeTab, setActiveTab] = useState('track'); // 'create' or 'track'
    const [loading, setLoading] = useState(false);
    
    // Create State
    const [createForm, setCreateForm] = useState({
        farmerId: 'FARMER-001', // Hardcoded for demo
        crop: 'Soybean',
        oilContent: '18',
        harvestDate: new Date().toISOString().split('T')[0]
    });
    const [createdBatch, setCreatedBatch] = useState(null);

    // Track State
    const [trackId, setTrackId] = useState('');
    const [traceData, setTraceData] = useState(null);
    const [error, setError] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/trace/sell', createForm);
            setCreatedBatch(res.data);
            setTrackId(res.data.batchId); // Auto-fill tracking for convenience
        } catch (err) {
            console.error(err);
            alert('Error creating batch');
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTraceData(null);
        try {
            const res = await axios.get(`http://localhost:5000/api/trace/track/${trackId}`);
            setTraceData(res.data);
        } catch (err) {
            console.error(err);
            setError('Batch ID not found or invalid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <QrCode className="text-purple-600" /> Traceability & Passport
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('track')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'track' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Consumer Track
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'create' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Farmer Sell
                    </button>
                </div>
            </div>

            {activeTab === 'create' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Generate Digital Passport</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Crop Type</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
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
                                <label className="block text-sm font-medium text-gray-700">Oil Content (%)</label>
                                <input 
                                    type="number" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                    value={createForm.oilContent}
                                    onChange={(e) => setCreateForm({...createForm, oilContent: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Harvest Date</label>
                                <input 
                                    type="date" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                    value={createForm.harvestDate}
                                    onChange={(e) => setCreateForm({...createForm, harvestDate: e.target.value})}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Create Passport & Sell'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                        {createdBatch ? (
                            <div className="animate-fade-in">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                                    <QrCode size={120} className="text-gray-800 mx-auto" />
                                </div>
                                <h4 className="text-green-600 font-bold text-lg mb-1">Passport Created!</h4>
                                <p className="text-xs text-gray-500 mb-2">Batch ID:</p>
                                <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono break-all select-all">
                                    {createdBatch.batchId}
                                </code>
                                <div className="mt-4 text-left text-sm text-gray-600 w-full">
                                    <p><strong>Digital Hash:</strong> {createdBatch.digitalPassport.substring(0, 20)}...</p>
                                    <p><strong>Block Index:</strong> #{createdBatch.blockIndex}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400">
                                <Package size={64} className="mx-auto mb-2 opacity-50" />
                                <p>Fill the form to generate a blockchain-verified digital passport for your produce.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'track' && (
                <div>
                    <form onSubmit={handleTrack} className="flex gap-2 mb-8">
                        <input 
                            type="text" 
                            placeholder="Enter Batch ID / Scan QR..." 
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                            value={trackId}
                            onChange={(e) => setTrackId(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
                        >
                            <Search size={18} /> Track
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {traceData && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800">Product Journey</h3>
                                    <p className="text-xs text-gray-500">Batch: {traceData.batchId}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${traceData.ledgerIntegrity === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {traceData.ledgerIntegrity}
                                </div>
                            </div>
                            
                            <div className="p-6 relative">
                                {/* Timeline Line */}
                                <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gray-200"></div>

                                <div className="space-y-8">
                                    {traceData.history.map((block, index) => (
                                        <div key={index} className="relative flex items-start gap-6">
                                            <div className="z-10 flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-sm mt-1"></div>
                                            <div className="flex-1 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-gray-800">
                                                        {block.data.action === 'HARVEST_SOLD' ? 'Harvested & Sold' : 
                                                         block.data.action === 'PROCESSED' ? 'Processing Unit' : 'Status Update'}
                                                    </h4>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={12} /> {new Date(block.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                
                                                {block.data.action === 'HARVEST_SOLD' && (
                                                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                                                        <p><span className="font-semibold">Farmer:</span> {block.data.farmerId}</p>
                                                        <p><span className="font-semibold">Crop:</span> {block.data.crop}</p>
                                                        <p><span className="font-semibold">Oil Content:</span> {block.data.oilContent}%</p>
                                                        <p><span className="font-semibold">Harvest Date:</span> {block.data.harvestDate}</p>
                                                    </div>
                                                )}

                                                {block.data.action === 'PROCESSED' && (
                                                    <div className="text-sm text-gray-600">
                                                        <p><span className="font-semibold">Processor:</span> {block.data.processorId}</p>
                                                        <p><span className="font-semibold">Details:</span> {block.data.details}</p>
                                                    </div>
                                                )}
                                                
                                                <div className="mt-3 pt-2 border-t border-gray-100">
                                                    <p className="text-[10px] text-gray-400 font-mono truncate">Hash: {block.hash}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TraceabilityWidget;