import React, { useState, useEffect } from 'react';
import { Factory, LogOut, Settings, Activity, Truck, Package, Search, CheckCircle, AlertCircle, Mic, Volume2, Building2, Users, FileText, TrendingUp } from 'lucide-react';
import api from './api';
import TraceabilityTree from './components/TraceabilityTree';

// Mock Data for Govt Schemes
const GOVT_SCHEMES = [
  {
    id: 'pmksy',
    name: 'PMKSY (Irrigation)',
    description: 'Pradhan Mantri Krishi Sinchayee Yojana - Subsidy for drip irrigation equipment.',
    status: 'Active',
    deadline: '31st Dec 2024'
  },
  {
    id: 'nmoop',
    name: 'NMOOP (Oilseeds)',
    description: 'National Mission on Oilseeds and Oil Palm - Seed distribution and technology transfer.',
    status: 'Open',
    deadline: '15th Jan 2025'
  },
  {
    id: 'aif',
    name: 'Agri Infra Fund',
    description: 'Financing facility for post-harvest management infrastructure.',
    status: 'Active',
    deadline: 'Ongoing'
  }
];

// Mock Data for FPO Deliveries
const FPO_DELIVERIES = [
  { id: 1, fpo: 'Narmada Kisan FPO', crop: 'Soybean', quantity: 150, status: 'In Transit', eta: '2 Hours' },
  { id: 2, fpo: 'Malwa Organic FPO', crop: 'Mustard', quantity: 80, status: 'Arrived', eta: 'Gate 2' },
  { id: 3, fpo: 'Satpura Agro FPO', crop: 'Groundnut', quantity: 120, status: 'Scheduled', eta: 'Tomorrow' }
];

const ProcessorApp = ({ user, onLogout }) => {
  const [incomingStock, setIncomingStock] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [traceHistory, setTraceHistory] = useState([]);
  const [processingStatus, setProcessingStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, schemes, fpo

  useEffect(() => {
    fetchIncomingStock();
  }, []);

  const fetchIncomingStock = async () => {
    try {
      const res = await api.get('/produce');
      const validStock = res.data.filter(item => item.batchId);
      setIncomingStock(validStock);
    } catch (err) {
      console.error("Failed to fetch stock", err);
    }
  };

  const handleSelectBatch = async (batch) => {
    setSelectedBatch(batch);
    setLoading(true);
    try {
      const res = await api.get(`/trace/track/${batch.batchId}`);
      setTraceHistory(res.data.history);
    } catch (err) {
      console.error("Failed to fetch trace", err);
      setTraceHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessBatch = async () => {
    if (!selectedBatch) return;
    setProcessingStatus('processing');
    speak("Processing started for batch " + selectedBatch.batchId);
    try {
      await api.post('/trace/process', {
        batchId: selectedBatch.batchId,
        processorId: user?.id || 'PROC-001',
        processingDate: new Date().toISOString(),
        details: 'Oil Extraction & Refining - Quality Grade A'
      });
      
      const res = await api.get(`/trace/track/${selectedBatch.batchId}`);
      setTraceHistory(res.data.history);
      setProcessingStatus('completed');
      speak("Processing completed successfully.");
      setTimeout(() => setProcessingStatus(''), 3000);
    } catch (err) {
      console.error("Failed to process", err);
      setProcessingStatus('error');
      speak("Error in processing batch.");
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Factory className="text-orange-600" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Processing Unit Portal</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('schemes')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'schemes' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Govt Schemes
              </button>
              <button 
                onClick={() => setActiveTab('fpo')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'fpo' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                FPO Connect
              </button>
            </nav>

            <div className="text-right hidden md:block border-l pl-6">
              <p className="text-sm font-bold text-gray-900">{user?.name || 'Processor'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Processing Unit'}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Incoming Stock */}
              <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Truck size={20} className="text-blue-600"/> Incoming Stock
                        </h2>
                        <button onClick={() => speak("You have " + incomingStock.length + " incoming shipments.")} className="p-1 hover:bg-gray-100 rounded-full">
                          <Volume2 size={16} className="text-gray-400" />
                        </button>
                      </div>
                      
                      <div className="space-y-3 max-h-[600px] overflow-y-auto">
                          {incomingStock.length === 0 ? (
                              <p className="text-gray-500 text-sm">No incoming shipments found.</p>
                          ) : (
                              incomingStock.map(item => (
                                  <div 
                                      key={item.id} 
                                      onClick={() => handleSelectBatch(item)}
                                      className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedBatch?.id === item.id ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'}`}
                                  >
                                      <div className="flex justify-between items-start">
                                          <div>
                                              <h3 className="font-bold text-gray-800">{item.cropName}</h3>
                                              <p className="text-xs text-gray-500">ID: {item.batchId?.substring(0, 8)}...</p>
                                          </div>
                                          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                              {item.quantity} Qtl
                                          </span>
                                      </div>
                                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                          <Activity size={12} />
                                          <span>{item.type}</span>
                                          <span className="mx-1">•</span>
                                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-6 rounded-xl shadow-lg text-white">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <TrendingUp size={20} /> Daily Throughput
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-indigo-200 text-xs uppercase">Processed</p>
                        <p className="text-2xl font-bold">1,250 Qtl</p>
                      </div>
                      <div>
                        <p className="text-indigo-200 text-xs uppercase">Efficiency</p>
                        <p className="text-2xl font-bold">94%</p>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Right Column: Processing & Traceability */}
              <div className="lg:col-span-2 space-y-6">
                  {selectedBatch ? (
                      <>
                          {/* Action Panel */}
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                              <div className="flex justify-between items-center mb-6">
                                  <div>
                                      <h2 className="text-xl font-bold text-gray-900">Batch Processing</h2>
                                      <p className="text-gray-500 text-sm">Manage processing for Batch #{selectedBatch.batchId.substring(0, 8)}</p>
                                  </div>
                                  <div className="flex gap-2">
                                      <button 
                                          onClick={handleProcessBatch}
                                          disabled={processingStatus === 'processing' || processingStatus === 'completed'}
                                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                                              processingStatus === 'completed' 
                                              ? 'bg-green-100 text-green-700' 
                                              : 'bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50'
                                          }`}
                                      >
                                          {processingStatus === 'processing' ? (
                                              <Activity className="animate-spin" size={20} />
                                          ) : processingStatus === 'completed' ? (
                                              <CheckCircle size={20} />
                                          ) : (
                                              <Settings size={20} />
                                          )}
                                          {processingStatus === 'completed' ? 'Processed' : 'Start Processing'}
                                      </button>
                                  </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 mb-6">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                      <p className="text-xs text-gray-500 uppercase">Farmer</p>
                                      <p className="font-bold text-gray-900">{selectedBatch.farmerName || 'Unknown'}</p>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                      <p className="text-xs text-gray-500 uppercase">Quality</p>
                                      <p className="font-bold text-gray-900">{selectedBatch.type}</p>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                      <p className="text-xs text-gray-500 uppercase">Status</p>
                                      <p className="font-bold text-blue-600">Ready for Processing</p>
                                  </div>
                              </div>
                          </div>

                          {/* Traceability Tree */}
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                              <h3 className="text-lg font-bold text-gray-900 mb-4">Supply Chain Traceability</h3>
                              {loading ? (
                                  <div className="flex justify-center p-8">
                                      <Activity className="animate-spin text-orange-500" size={32} />
                                  </div>
                              ) : (
                                  <TraceabilityTree history={traceHistory} />
                              )}
                          </div>
                      </>
                  ) : (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[400px] flex flex-col items-center justify-center text-center p-8">
                          <div className="bg-gray-50 p-6 rounded-full mb-4">
                              <Search size={48} className="text-gray-400" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Batch</h3>
                          <p className="text-gray-500 max-w-md">
                              Select an incoming shipment from the list to view its traceability history and start processing.
                          </p>
                      </div>
                  )}
              </div>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Government Schemes & Subsidies</h2>
              <button onClick={() => speak("Here are the active government schemes for your processing unit.")} className="flex items-center gap-2 text-indigo-600 font-medium hover:bg-indigo-50 px-3 py-2 rounded-lg">
                <Volume2 size={20} /> Read Aloud
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GOVT_SCHEMES.map(scheme => (
                <div key={scheme.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FileText className="text-green-600" size={24} />
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{scheme.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{scheme.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{scheme.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
                    <span>Deadline: {scheme.deadline}</span>
                    <button className="text-indigo-600 font-bold hover:underline">Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fpo' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">FPO Deliveries & Connect</h2>
              <button onClick={() => speak("Tracking 3 active FPO deliveries.")} className="flex items-center gap-2 text-indigo-600 font-medium hover:bg-indigo-50 px-3 py-2 rounded-lg">
                <Volume2 size={20} /> Read Aloud
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-600 text-sm">FPO Name</th>
                    <th className="px-6 py-4 font-bold text-gray-600 text-sm">Crop</th>
                    <th className="px-6 py-4 font-bold text-gray-600 text-sm">Quantity</th>
                    <th className="px-6 py-4 font-bold text-gray-600 text-sm">Status</th>
                    <th className="px-6 py-4 font-bold text-gray-600 text-sm">ETA / Location</th>
                    <th className="px-6 py-4 font-bold text-gray-600 text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {FPO_DELIVERIES.map(delivery => (
                    <tr key={delivery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                        <Users size={16} className="text-gray-400" /> {delivery.fpo}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{delivery.crop}</td>
                      <td className="px-6 py-4 text-gray-600">{delivery.quantity} Qtl</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          delivery.status === 'Arrived' ? 'bg-green-100 text-green-700' :
                          delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{delivery.eta}</td>
                      <td className="px-6 py-4">
                        <button className="text-indigo-600 font-bold text-sm hover:underline">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ProcessorApp;