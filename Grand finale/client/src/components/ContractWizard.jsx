import React, { useState } from 'react';
import { contractTemplates } from '../data/contract_data';
import { FileText, Upload, Link as LinkIcon, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const ContractWizard = ({ preFilledData, onExecute }) => {
  const { getStock } = useInventory();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedCropId: preFilledData ? contractTemplates.find(t => t.crop === preFilledData.crop)?.id || '' : '',
    quantity: preFilledData ? preFilledData.qty.replace(' Qtl', '') : '',
    price: preFilledData ? preFilledData.price : '',
    assayingFile: null,
    nwrNumber: '',
    farmerName: '',
    buyerName: preFilledData ? preFilledData.buyer : 'Biometrix Aggregators Ltd.',
    deliveryDate: ''
  });

  const selectedTemplate = contractTemplates.find(t => t.id === formData.selectedCropId);
  
  // Calculate Payment Split if Lien exists
  const selectedCropName = selectedTemplate?.crop;
  const stockItem = getStock(selectedCropName);
  const encumberedValue = stockItem ? (stockItem.encumberedValue || 0) : 0;
  const lienHolder = stockItem ? stockItem.lienHolder : null;

  const totalSaleValue = parseFloat(formData.quantity || 0) * parseFloat(formData.price || 0);
  const deduction = lienHolder ? Math.min(totalSaleValue, encumberedValue) : 0;
  const netPayout = totalSaleValue - deduction;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      const selectedCrop = contractTemplates.find(t => t.id === formData.selectedCropId)?.crop;
      const stock = getStock(selectedCrop);
      const available = stock ? stock.available : 0;
      
      if (parseFloat(value) > available) {
        alert(`You only have ${available} Qtl available to sell. The rest is locked or not in stock.`);
        return; // Prevent update
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, assayingFile: e.target.files[0] }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep1_Selection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <FileText className="text-blue-600" /> Select Crop & Specifications
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Crop</label>
            <select 
              name="selectedCropId" 
              value={formData.selectedCropId} 
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Choose a Crop --</option>
              {contractTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.crop} ({template.variety})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name (Farmer)</label>
            <input 
              type="text" 
              name="farmerName" 
              value={formData.farmerName} 
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
            <input 
              type="text" 
              name="buyerName" 
              value={formData.buyerName} 
              onChange={handleInputChange}
              placeholder="Enter buyer company name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {selectedTemplate && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Quintals)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="quantity" 
                    value={formData.quantity} 
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                    max={selectedTemplate ? getStock(selectedTemplate.crop)?.available : 1000}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    Max: {selectedTemplate ? getStock(selectedTemplate.crop)?.available : 0}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Quintal (₹)</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleInputChange}
                  placeholder="e.g. 5200"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <input 
                  type="date" 
                  name="deliveryDate" 
                  value={formData.deliveryDate} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </>
          )}
        </div>

        {selectedTemplate ? (
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} /> Standard Specifications
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span className="text-gray-600">Delivery Location</span>
                <span className="font-semibold text-gray-800 text-right">{selectedTemplate.deliveryLocation}</span>
              </div>
              {Object.entries(selectedTemplate.qualitySpecs).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-blue-200 pb-2 last:border-0">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-600 font-medium">
                  * {selectedTemplate.penaltyClause}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            Select a crop to view standards
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2_DigitalProof = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Upload className="text-blue-600" /> Digital Proof (Quality Assurance)
      </h3>
      
      <div className="bg-white p-8 border-2 border-dashed border-blue-300 rounded-xl text-center hover:bg-blue-50 transition-colors cursor-pointer relative">
        <input 
          type="file" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.jpg,.png"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Upload size={32} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Upload Assaying Certificate (Lab Report)</p>
            <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, JPG, PNG</p>
          </div>
          {formData.assayingFile && (
            <div className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle size={16} />
              {formData.assayingFile.name}
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
        <strong>Note:</strong> The assaying certificate must be from an NABL accredited laboratory and not older than 7 days.
      </div>
    </div>
  );

  const renderStep3_NWRLink = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <LinkIcon className="text-blue-600" /> Link e-NWR (Electronic Negotiable Warehouse Receipt)
      </h3>

      <div className="max-w-xl mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Receipt Number (e-NWR)</label>
          <div className="relative">
            <input 
              type="text" 
              name="nwrNumber" 
              value={formData.nwrNumber} 
              onChange={handleInputChange}
              placeholder="e.g. WR-2024-XXXX-YYYY"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg"
            />
            <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
          <p>Linking your e-NWR allows for automatic quantity verification and seamless ownership transfer upon contract settlement.</p>
        </div>
      </div>
    </div>
  );

  const renderStep4_LegalReview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <FileText className="text-blue-600" /> Legal Review & Agreement
      </h3>

      <div className="bg-white border-2 border-gray-200 p-8 rounded-xl shadow-sm font-serif relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gray-100 px-4 py-2 rounded-bl-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
          Draft Agreement
        </div>

        <h2 className="text-2xl font-bold text-center mb-8 underline decoration-double decoration-gray-300">
          FORWARD SALE CONTRACT
        </h2>

        <div className="space-y-6 text-gray-800 leading-relaxed">
          <p>
            This agreement is made on <strong>{new Date().toLocaleDateString()}</strong> between <strong>{formData.farmerName || "[Seller Name]"}</strong> (hereinafter referred to as "Seller") and <strong>{formData.buyerName || "[Buyer Name]"}</strong> (hereinafter referred to as "Buyer").
          </p>

          <p>
            <strong>1. COMMODITY & QUANTITY:</strong><br/>
            The Seller agrees to sell and deliver <strong>{formData.quantity} Quintals</strong> of <strong>{selectedTemplate?.crop} ({selectedTemplate?.variety})</strong>.
          </p>

          <p>
            <strong>2. PRICE & PAYMENT:</strong><br/>
            The agreed price is <strong>₹{formData.price}/Quintal</strong>. Total Value: <strong>₹{totalSaleValue.toLocaleString()}</strong>.
            <br/>Payment shall be made according to <strong>{selectedTemplate?.paymentTerms}</strong>.
          </p>

          {lienHolder && deduction > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg my-4 text-sm">
              <p className="font-bold text-red-800 mb-2 flex items-center gap-2">
                <ShieldCheck size={16} /> Lien Deduction Notice (Smart Contract Auto-Execution)
              </p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sale Value:</span>
                  <span className="font-mono font-bold">₹ {totalSaleValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>Less: Auto-Repayment to {lienHolder}:</span>
                  <span className="font-mono">- ₹ {deduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-red-200 pt-1 mt-1">
                  <span className="font-bold text-green-700">Net Payout to Seller:</span>
                  <span className="font-mono font-bold text-green-700">₹ {netPayout.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <p>
            <strong>3. DELIVERY TERMS:</strong><br/>
            Delivery shall be made to <strong>{selectedTemplate?.deliveryLocation}</strong> by <strong>{formData.deliveryDate}</strong> on <strong>{selectedTemplate?.deliveryLogic}</strong> basis.
          </p>

          <p>
            <strong>4. QUALITY STANDARDS:</strong><br/>
            The produce must meet NCDEX Quality Norms:
            <ul className="list-disc pl-6 mt-2 text-sm">
              {selectedTemplate && Object.entries(selectedTemplate.qualitySpecs).map(([key, value]) => (
                <li key={key}><span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {value}</li>
              ))}
            </ul>
          </p>

          <p>
            <strong>5. PENALTY & FORCE MAJEURE:</strong><br/>
            {selectedTemplate?.penaltyClause}. {selectedTemplate?.forceMajeure}.
          </p>

          <div className="mt-8 pt-8 border-t border-gray-300 flex justify-between items-end">
            <div className="text-center">
              <div className="font-script text-2xl text-blue-600 mb-2">{formData.farmerName || "Seller"}</div>
              <div className="border-t border-gray-400 w-40 mx-auto"></div>
              <div className="text-xs text-gray-500 mt-1">Signature of Seller</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-400 mb-2">[Digital Signature]</div>
              <div className="border-t border-gray-400 w-40 mx-auto"></div>
              <div className="text-xs text-gray-500 mt-1">Authorized Signatory for {formData.buyerName || "Buyer"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-blue-600' : 'text-gray-400'}`}>
                {s === 1 ? 'Selection' : s === 2 ? 'Proof' : s === 3 ? 'Link e-NWR' : 'Review'}
              </span>
            </div>
          ))}
          {/* Connecting Line */}
          <div className="absolute top-9 left-0 w-full h-1 bg-gray-200 -z-0 hidden md:block">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 min-h-[400px]">
        {step === 1 && renderStep1_Selection()}
        {step === 2 && renderStep2_DigitalProof()}
        {step === 3 && renderStep3_NWRLink()}
        {step === 4 && renderStep4_LegalReview()}
      </div>

      {/* Footer Controls */}
      <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center">
        <button 
          onClick={prevStep}
          disabled={step === 1}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
            step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} /> Back
        </button>

        {step < 4 ? (
          <button 
            onClick={nextStep}
            disabled={step === 1 && (!formData.selectedCropId || !formData.farmerName)}
            className={`flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all ${
              step === 1 && (!formData.selectedCropId || !formData.farmerName) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            Next Step <ArrowRight size={20} />
          </button>
        ) : (
          <button 
            onClick={() => onExecute ? onExecute(formData) : alert('Contract Created Successfully! (Demo)')}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:bg-green-700 transition-all hover:scale-105"
          >
            <ShieldCheck size={20} /> Sign & Execute Contract
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractWizard;
