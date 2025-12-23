import React, { useState } from 'react';
import { Sprout, X, AlertTriangle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { financialNorms } from '../data/financial_norms';

const HarvestDeclarationModal = ({ onClose }) => {
  const { declareHarvest } = useInventory();
  const [formData, setFormData] = useState({
    landId: 'L-101', // Default to the one with KCC loan for demo
    crop: 'Soybean',
    quantity: '',
    seedVariety: 'Traditional'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    declareHarvest(formData.landId, formData.crop, formData.quantity, formData.seedVariety);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-green-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sprout size={20} /> Declare Harvest
          </h2>
          <button onClick={onClose} className="hover:bg-green-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-800 flex gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <p>Declaring harvest adds stock to your inventory. If this land has an active KCC loan, the lien will automatically attach to this produce.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land ID (Survey No.)</label>
            <select 
              value={formData.landId}
              onChange={(e) => setFormData({...formData, landId: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="L-101">L-101 (Has Active KCC)</option>
              <option value="L-102">L-102 (Clear Title)</option>
              <option value="L-103">L-103 (Leased)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Harvested</label>
            <select 
              value={formData.crop}
              onChange={(e) => setFormData({...formData, crop: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              {financialNorms.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seed Variety</label>
            <select 
              value={formData.seedVariety}
              onChange={(e) => setFormData({...formData, seedVariety: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Traditional">Traditional / Desi</option>
              <option value="Hybrid">Hybrid / HYV (High Yield Variety)</option>
            </select>
            {formData.seedVariety === 'Hybrid' && (
              <p className="text-xs text-green-600 mt-1">
                * Hybrid seeds allow for 30% higher yield declaration limit.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Quintals)</label>
            <input 
              type="number" 
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              placeholder="e.g. 50"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
          >
            Add to Inventory
          </button>
        </form>
      </div>
    </div>
  );
};

export default HarvestDeclarationModal;
