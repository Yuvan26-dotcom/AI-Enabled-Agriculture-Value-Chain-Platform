import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle, XCircle, MoreVertical, FileText, MapPin } from 'lucide-react';
import api from '../../api';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBid, setNewBid] = useState({ crop: 'Soybean', quantity: '', price: '', location: '' });

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      // In a real app with auth, this would be api.get('/bids/my-bids')
      // For now, we'll fetch all bids or use a public endpoint
      const res = await api.get('/bids');
      setBids(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bids:', err);
      setLoading(false);
    }
  };

  const handleCreateBid = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/bids', newBid);
      setBids([res.data, ...bids]);
      setShowCreateModal(false);
      setNewBid({ crop: 'Soybean', quantity: '', price: '', location: '' });
    } catch (err) {
      console.error('Error creating bid:', err);
      alert('Failed to create bid');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search bids by ID, Crop or Location..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Filter size={18} /> Filter
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 flex-1 md:flex-none justify-center"
          >
            <Plus size={20} /> Create New Bid
          </button>
        </div>
      </div>

      {/* Bids List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading bids...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold text-gray-600 text-sm">Bid ID</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">Crop Requirement</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">Target Price</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">Location</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">Status</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">Responses</th>
                  <th className="p-4 font-bold text-gray-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bids.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">No active bids found. Create one to get started.</td>
                  </tr>
                ) : (
                  bids.map((bid) => (
                    <tr key={bid._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-mono text-sm text-blue-600 font-bold">#{bid._id.slice(-6)}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{bid.crop}</div>
                        <div className="text-xs text-gray-500">{bid.quantity} Qtl</div>
                      </td>
                      <td className="p-4 font-medium text-gray-700">₹ {bid.price}/Qtl</td>
                      <td className="p-4 text-sm text-gray-600 flex items-center gap-1">
                        <MapPin size={14} /> {bid.location}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit
                          ${bid.status === 'Active' ? 'bg-blue-100 text-blue-700' : 
                            bid.status === 'Fulfilled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {bid.status === 'Active' && <Clock size={12} />}
                          {bid.status === 'Fulfilled' && <CheckCircle size={12} />}
                          {bid.status === 'Expired' && <XCircle size={12} />}
                          {bid.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {bid.responses && bid.responses.length > 0 ? (
                            <>
                              <div className="flex -space-x-2">
                                {[...Array(Math.min(3, bid.responses.length))].map((_, i) => (
                                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                                    F{i+1}
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">+{bid.responses.length} offers</span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No offers yet</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Bid Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Create New Procurement Bid</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateBid} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Crop Type</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newBid.crop}
                  onChange={(e) => setNewBid({...newBid, crop: e.target.value})}
                >
                  <option>Soybean</option>
                  <option>Mustard</option>
                  <option>Groundnut</option>
                  <option>Sunflower</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Quantity (Qtl)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBid.quantity}
                    onChange={(e) => setNewBid({...newBid, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Target Price (₹/Qtl)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBid.price}
                    onChange={(e) => setNewBid({...newBid, price: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Indore Warehouse"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newBid.location}
                  onChange={(e) => setNewBid({...newBid, location: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Publish Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBids;
