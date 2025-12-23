import React, { useState, useMemo } from 'react';
import { CheckCircle, MapPin, User, AlertTriangle, Info, X, Lock } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { getMarketData } from '../data/market_data';

const BuyerBidsTable = ({ onAcceptBid, selectedState, selectedCrop, selectedDistrict }) => {
  const { getStock } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [selectedBidForModal, setSelectedBidForModal] = useState(null);
  const [partialQty, setPartialQty] = useState('');

  // Fetch Dynamic Bids based on Context
  const bids = useMemo(() => {
    if (!selectedState || !selectedCrop) return [];
    try {
      const marketData = getMarketData(selectedState, selectedCrop, selectedDistrict);
      return marketData.buyers || [];
    } catch (error) {
      console.error("Error fetching market data:", error);
      return [];
    }
  }, [selectedState, selectedCrop, selectedDistrict]);

  const handleAcceptClick = (bid) => {
    // For dynamic bids, we need to normalize the crop name if needed
    // But here we assume bid.crop is not present in the generated buyer object, 
    // so we use the selectedCrop prop.
    const cropName = selectedCrop; 
    const stock = getStock(cropName);
    
    // bid.qty_total is a number in the new data structure
    const bidQty = bid.qty_total; 
    const farmerAvailable = stock ? stock.available : 0;

    // Construct a standardized bid object for the parent handler
    const standardizedBid = {
      ...bid,
      crop: cropName,
      qty: `${bidQty} Qtl`,
      price: bid.price,
      buyer: bid.buyer_name
    };

    if (bidQty > farmerAvailable) {
      // Whale Logic: Partial Fulfillment
      setSelectedBidForModal(standardizedBid);
      setPartialQty(farmerAvailable.toString());
      setShowModal(true);
    } else {
      onAcceptBid(standardizedBid);
    }
  };

  const confirmPartialFill = () => {
    if (selectedBidForModal) {
      const updatedBid = {
        ...selectedBidForModal,
        qty: `${partialQty} Qtl` // Override with farmer's quantity
      };
      onAcceptBid(updatedBid);
      setShowModal(false);
      setSelectedBidForModal(null);
    }
  };

  if (bids.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
        <p className="text-gray-500">No active bids found for {selectedCrop} in {selectedState}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative">
      {/* Partial Fulfillment Modal */}
      {showModal && selectedBidForModal && (
        <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Info className="text-blue-600" /> Partial Fulfillment
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              This buyer wants <strong>{selectedBidForModal.qty}</strong>, but you only have <strong>{getStock(selectedBidForModal.crop)?.available} Qtl</strong> available.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Your Offer Quantity (Qtl)</label>
              <input 
                type="number" 
                value={partialQty}
                onChange={(e) => setPartialQty(e.target.value)}
                className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
              />
              <p className="text-xs text-blue-600 mt-2">
                You are filling <strong>{((parseInt(partialQty) / parseInt(selectedBidForModal.qty.split(' ')[0])) * 100).toFixed(1)}%</strong> of this bulk order.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPartialFill}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                Confirm Offer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <th className="p-4">Buyer / FPO</th>
              <th className="p-4">Location</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Price / Qtl</th>
              <th className="p-4">Deadline</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bids.map((bid) => (
              <tr key={bid.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm
                      ${bid.type === 'FPO' ? 'bg-green-600' : 'bg-blue-600'}`}>
                      {bid.buyer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{bid.buyer_name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {bid.type === 'FPO' ? <User size={12} /> : <Lock size={12} />}
                        {bid.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <MapPin size={16} className="text-gray-400" />
                    {bid.location}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-mono font-bold text-gray-700">{bid.qty_total} Qtl</span>
                  <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${(bid.qty_filled / bid.qty_total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{bid.qty_filled} filled</p>
                </td>
                <td className="p-4">
                  <span className="font-bold text-green-700 text-lg">₹{bid.price}</span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {bid.deadline}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleAcceptClick(bid)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                  >
                    Accept <CheckCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyerBidsTable;
