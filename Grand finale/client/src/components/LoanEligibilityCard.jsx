import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, ShieldCheck, Sprout, Info, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { financialNorms } from '../data/financial_norms';
import { useInventory } from '../context/InventoryContext';

const LoanEligibilityCard = ({ onCalculate, initialState, loanType = 'KCC' }) => {
  const { inventory } = useInventory();
  const [selectedCropId, setSelectedCropId] = useState(financialNorms[0].id);
  const [area, setArea] = useState(2.0); // Default 2 acres
  
  // Auto-select crop from Dashboard Deep-Link
  useEffect(() => {
    if (initialState && initialState.crop) {
      const norm = financialNorms.find(c => c.name === initialState.crop);
      if (norm) {
        setSelectedCropId(norm.id);
      }
    }
  }, [initialState]);

  const selectedCrop = financialNorms.find(c => c.id === selectedCropId) || financialNorms[0];
  
  // Check if user actually has this crop in inventory
  const inventoryItem = inventory.find(item => item.crop === selectedCrop.name);
  const hasInventory = inventoryItem && inventoryItem.total > 0;
  const availableStock = inventoryItem ? inventoryItem.available : 0;
  const encumberedValue = inventoryItem ? (inventoryItem.encumberedValue || 0) : 0;
  const isVerified = inventoryItem ? inventoryItem.verificationStatus === 'VERIFIED_eNWR' : false;

  // --- Calculation Logic ---
  let baseLoan = 0;
  let totalLimit = 0;
  let calculationDetails = {};

  if (loanType === 'KCC') {
    // RBI KCC Formula Calculations
    baseLoan = area * selectedCrop.scaleOfFinance;
    const householdBuffer = baseLoan * 0.10; // 10% for household consumption
    const maintenanceBuffer = baseLoan * 0.20; // 20% for farm maintenance
    
    // Premium: 2% for Kharif, 1.5% for Rabi
    const premiumRate = selectedCrop.season === "Rabi" ? 0.015 : 0.02;
    const insurancePremium = baseLoan * premiumRate;
    
    totalLimit = baseLoan + householdBuffer + maintenanceBuffer + insurancePremium;
    
    calculationDetails = {
      baseLoan,
      householdBuffer,
      maintenanceBuffer,
      insurancePremium
    };
  } else {
    // Warehouse Loan Logic (Pledge)
    // Limit = (Stock Value - Encumbered Value) * 0.75 (LTV)
    // Mock Price from financial norms or API (using scale of finance as proxy for price/qtl for demo)
    const marketPrice = 5000; // Hardcoded mock price for demo
    const totalStockValue = availableStock * marketPrice;
    const netCollateral = Math.max(0, totalStockValue - encumberedValue);
    
    baseLoan = netCollateral;
    totalLimit = baseLoan * 0.75; // 75% LTV

    calculationDetails = {
      marketValue: totalStockValue,
      encumberedValue: encumberedValue,
      netCollateral: netCollateral,
      ltvRatio: 0.75
    };
  }
  
  const isSubventionEligible = totalLimit < 300000;

  // Algo-Lending Logic: Repayment Confidence
  // Mock AI Predicted Revenue (Yield * Forecast Price)
  // In production, this comes from the Dashboard module
  const mockYieldPerAcre = 6; // Quintals
  const mockForecastPrice = 5400; // Rs/Quintal
  const predictedRevenue = area * mockYieldPerAcre * mockForecastPrice;
  
  const safetyRatio = predictedRevenue / (totalLimit || 1); // Avoid div by zero
  const isHighConfidence = safetyRatio > 1.5;
  const isRisky = safetyRatio < 1.2;

  // Pass data up to parent whenever calculation changes
  useEffect(() => {
    if (onCalculate) {
      onCalculate({
        crop: selectedCrop.name,
        area,
        baseLoan,
        totalLimit,
        isSubventionEligible,
        loanType // Pass loan type up
      });
    }
  }, [selectedCropId, area, totalLimit, onCalculate, loanType]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="bg-green-900 text-white p-4 flex items-center gap-3">
        <div className="bg-green-800 p-2 rounded-lg">
          <Calculator className="text-green-200" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold">{loanType === 'KCC' ? 'Regulatory KCC Calculator' : 'Warehouse Pledge Calculator'}</h2>
          <p className="text-xs text-green-200 opacity-80">
            {loanType === 'KCC' ? 'Strict RBI Guidelines Compliance' : 'Based on NWR (Negotiable Warehouse Receipt)'}
          </p>
        </div>
      </div>

      <div className="p-6 flex-grow space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Select Crop</label>
            <select 
              value={selectedCropId} 
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-sm"
            >
              {financialNorms.map(c => {
                // Highlight crops present in inventory
                const inStock = inventory.some(i => i.crop === c.name && i.total > 0);
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} {inStock ? '(In Stock)' : ''}
                  </option>
                );
              })}
            </select>
            {loanType === 'Warehouse' && !hasInventory && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle size={10} /> Warning: No inventory found for collateral.
              </p>
            )}
            {loanType === 'Warehouse' && hasInventory && !isVerified && (
              <p className="text-[10px] text-orange-600 mt-1 flex items-center gap-1 font-bold">
                <AlertTriangle size={10} /> Pending Physical Verification.
              </p>
            )}
          </div>
          
          {loanType === 'KCC' ? (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Land Area (Acres)</label>
              <input 
                type="number" 
                value={area}
                onChange={(e) => setArea(Math.max(0.1, Number(e.target.value)))}
                min="0.1"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Available Stock (Qtl)</label>
              <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                {availableStock} Qtl
              </div>
            </div>
          )}
        </div>

        {/* Bank Ledger View */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
            <span className="font-mono text-xs font-bold text-gray-600 uppercase">Loan Statement</span>
            <span className="text-xs text-gray-500">FY 2024-25</span>
          </div>
          
          <div className="divide-y divide-gray-200 text-sm">
            {loanType === 'KCC' ? (
              <>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-gray-600">Base Scale of Finance</span>
                  <span className="font-mono">₹ {calculationDetails.baseLoan?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-4 py-2 bg-green-50/50">
                  <span className="text-gray-600 flex items-center gap-1">
                    Household Consumption <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">10%</span>
                  </span>
                  <span className="font-mono text-green-700">+ ₹ {calculationDetails.householdBuffer?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-4 py-2 bg-green-50/50">
                  <span className="text-gray-600 flex items-center gap-1">
                    Farm Maintenance <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">20%</span>
                  </span>
                  <span className="font-mono text-green-700">+ ₹ {calculationDetails.maintenanceBuffer?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-4 py-2 bg-red-50/50">
                  <span className="text-gray-600 flex items-center gap-1">
                    Crop Insurance <span className="text-[10px] bg-red-100 text-red-800 px-1 rounded">2%</span>
                  </span>
                  <span className="font-mono text-red-700">+ ₹ {calculationDetails.insurancePremium?.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-gray-600">Total Stock Value</span>
                  <span className="font-mono">₹ {calculationDetails.marketValue?.toLocaleString()}</span>
                </div>
                {calculationDetails.encumberedValue > 0 && (
                  <div className="flex justify-between px-4 py-2 bg-red-50/50">
                    <span className="text-red-600 flex items-center gap-1">
                      Less: Active KCC Lien
                    </span>
                    <span className="font-mono text-red-700">- ₹ {calculationDetails.encumberedValue?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between px-4 py-2 border-t border-dashed border-gray-300">
                  <span className="text-gray-600 font-medium">Net Eligible Collateral</span>
                  <span className="font-mono font-medium">₹ {calculationDetails.netCollateral?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-4 py-2 bg-blue-50/50">
                  <span className="text-gray-600 flex items-center gap-1">
                    LTV Ratio <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">75%</span>
                  </span>
                  <span className="font-mono text-blue-700">x 0.75</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between px-4 py-3 bg-gray-50 font-bold border-t-2 border-gray-300">
              <span className="text-gray-800">Total Limit</span>
              <span className="text-xl text-blue-900">
                {loanType === 'Warehouse' && !isVerified ? '₹ 0' : `₹ ${Math.round(totalLimit).toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Warning for Warehouse Loans */}
        {loanType === 'Warehouse' && !isVerified && hasInventory && (
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg flex items-start gap-2">
            <AlertTriangle className="text-orange-600 shrink-0 mt-1" size={18} />
            <div>
              <p className="text-sm font-bold text-orange-800">Collateral Not Verified</p>
              <p className="text-xs text-orange-700 mt-1">
                Your stock is declared but not yet verified by the warehouse. 
                Please deposit your produce to generate an e-NWR before applying for a pledge loan.
              </p>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className={`p-3 rounded-lg flex items-center gap-3 ${loanType === 'KCC' ? 'bg-green-50 border border-green-200' : 'bg-purple-50 border border-purple-200'}`}>
          <ShieldCheck className={loanType === 'KCC' ? 'text-green-600' : 'text-purple-600'} size={20} />
          <div>
            <p className={`text-sm font-bold ${loanType === 'KCC' ? 'text-green-800' : 'text-purple-800'}`}>
              {loanType === 'KCC' ? 'Hypothecation of Standing Crop' : 'Lien on Stored Produce'}
            </p>
            <p className={`text-xs ${loanType === 'KCC' ? 'text-green-600' : 'text-purple-600'}`}>
              {loanType === 'KCC' ? 'Future harvest pledged as security' : 'Physical stock locked as collateral'}
            </p>
          </div>
        </div>

        {/* Subvention Badge */}
        {isSubventionEligible ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
            <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-green-800">Eligible for Interest Subvention</p>
              <p className="text-xs text-green-700 mt-1">
                Since loan is &lt; ₹3 Lakhs, you qualify for 3% subvention. 
                <br/><strong>Effective Interest Rate: 4% p.a.</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
            <Info className="text-yellow-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-yellow-800">Standard Interest Rate Applies</p>
              <p className="text-xs text-yellow-700 mt-1">
                Loan amount exceeds ₹3 Lakhs limit for subvention.
                <br/><strong>Effective Interest Rate: ~7% p.a.</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanEligibilityCard;

