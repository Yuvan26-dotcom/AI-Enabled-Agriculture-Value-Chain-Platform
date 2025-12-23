import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Plus, CheckCircle, AlertCircle, XCircle, Upload, FileText, Loader2, Volume2 } from 'lucide-react';

const ProduceListings = ({ voiceMode, speak }) => {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    pricePerQuintal: '',
    type: 'Inorganic',
    certificateNumber: ''
  });
  
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [suggestedPrice, setSuggestedPrice] = useState(null);

  // Mock Market Prices (Base)
  const MARKET_PRICES = {
    'Soybean': 4800,
    'Groundnut': 6500,
    'Mustard': 5400,
    'Sunflower': 5600,
    'Sesame': 12000
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSpeak = (text) => {
    if (voiceMode && speak) {
      speak(text);
    }
  };

  // Update suggested price when crop or type changes
  useEffect(() => {
    if (formData.cropName && MARKET_PRICES[formData.cropName]) {
      let base = MARKET_PRICES[formData.cropName];
      let premium = 0;
      
      if (formData.type === 'Organic') {
        // 20% Premium for Organic
        premium = base * 0.20;
      }
      
      setSuggestedPrice({
        base: base,
        premium: premium,
        total: base + premium
      });
    } else {
      setSuggestedPrice(null);
    }
  }, [formData.cropName, formData.type]);

  const fetchListings = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/produce`);
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset verification if certificate number changes
    if (name === 'certificateNumber') {
      setVerificationResult(null);
    }
  };

  const verifyCertificate = async () => {
    if (!formData.certificateNumber) return;
    
    handleSpeak(t('verifying_certificate') || "Verifying certificate...");
    setVerifying(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/produce/verify-certificate`, {
        certificateNumber: formData.certificateNumber
      });
      
      setVerificationResult(res.data);
      if (res.data.valid) {
        handleSpeak(t('verification_success') || "Verification successful.");
      } else {
        handleSpeak(t('verification_failed') || "Verification failed.");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setVerificationResult({ valid: false, msg: "Verification failed or service unavailable" });
      handleSpeak(t('verification_error') || "Verification error.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSpeak(t('submitting_listing') || "Submitting listing...");
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/produce`, formData);
      
      setShowForm(false);
      setFormData({
        cropName: '',
        quantity: '',
        pricePerQuintal: '',
        type: 'Inorganic',
        certificateNumber: ''
      });
      setVerificationResult(null);
      fetchListings();
      handleSpeak(t('listing_created') || "Listing created successfully.");
    } catch (err) {
      console.error("Error creating listing:", err);
      handleSpeak(t('listing_error') || "Error creating listing.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> {t('verified') || "Verified"}</span>;
      case 'Pending Verification':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" /> {t('pending') || "Pending"}</span>;
      case 'No Certificate':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" /> {t('no_cert') || "No Cert"}</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('produce_listings') || "My Produce Listings"}</h2>
        <div className="flex gap-2">
            <button onClick={() => handleSpeak(t('produce_page_desc') || "Manage your produce listings here.")} className="p-2 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300">
                <Volume2 size={20} />
            </button>
            <button 
            onClick={() => {
                setShowForm(!showForm);
                if (!showForm) handleSpeak(t('add_new_listing') || "Add new listing.");
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
            {showForm ? <XCircle size={20} /> : <Plus size={20} />}
            {showForm ? (t('cancel') || "Cancel") : (t('add_listing') || "Add Listing")}
            </button>
        </div>
      </div>

      {/* Create Listing Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 animate-fade-in-down">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">{t('new_produce_listing') || "New Produce Listing"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_name') || "Crop Name"}</label>
                <select 
                  name="cropName" 
                  value={formData.cropName} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('select_crop') || "Select Crop"}</option>
                  {Object.keys(MARKET_PRICES).map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity_quintals') || "Quantity (Quintals)"}</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g. 50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('price_per_quintal') || "Price per Quintal (₹)"}</label>
                <input 
                  type="number" 
                  name="pricePerQuintal" 
                  value={formData.pricePerQuintal} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g. 4500"
                  required
                />
                {suggestedPrice && (
                  <div className="mt-1 text-xs">
                    <span className="text-gray-500">{t('market_base') || "Market Base"}: ₹{suggestedPrice.base}</span>
                    {formData.type === 'Organic' && (
                      <span className="text-green-600 font-medium ml-2">
                        + {t('organic_premium') || "Organic Premium"}: ₹{suggestedPrice.premium}
                      </span>
                    )}
                    <div className="text-blue-600 font-semibold mt-0.5">
                      {t('recommended') || "Recommended"}: ₹{suggestedPrice.total}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('farming_type') || "Farming Type"}</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      value="Inorganic" 
                      checked={formData.type === 'Inorganic'} 
                      onChange={handleInputChange}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>{t('conventional') || "Conventional"}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      value="Organic" 
                      checked={formData.type === 'Organic'} 
                      onChange={handleInputChange}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>{t('organic') || "Organic"}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Organic Certificate Section */}
            {formData.type === 'Organic' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <FileText size={18} />
                  {t('organic_certification') || "Organic Certification"}
                </h4>
                <p className="text-sm text-green-600 mb-3">
                  {t('provide_cert_number') || "Please provide your NPOP/APEDA certificate number for verification."}
                  <br/>
                  <span className="text-xs text-gray-500">{t('supported_bodies') || "Supported Bodies: Bureau Veritas (NPOP/NAB/001), ECOCERT (NPOP/NAB/002), etc."}</span>
                </p>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    name="certificateNumber" 
                    value={formData.certificateNumber} 
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Certificate No. (e.g. ORG-123456 or NPOP/NAB/001/12345)"
                  />
                  <button 
                    type="button"
                    onClick={verifyCertificate}
                    disabled={verifying || !formData.certificateNumber}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {verifying ? <Loader2 className="animate-spin" size={18} /> : (t('verify') || "Verify")}
                  </button>
                </div>

                {/* Verification Result Feedback */}
                {verificationResult && (
                  <div className={`mt-3 p-3 rounded-md text-sm flex items-start gap-2 ${verificationResult.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {verificationResult.valid ? (
                      <>
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">{t('cert_verified') || "Certificate Verified Successfully"}</p>
                          <p>{t('holder') || "Holder"}: {verificationResult.details.holder}</p>
                          <p>{t('expiry') || "Expiry"}: {verificationResult.details.expiry}</p>
                          <p className="text-xs mt-1">{t('certified_by') || "Certified by"}: {verificationResult.details.body} ({verificationResult.details.accreditation})</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{verificationResult.msg || "Invalid Certificate"}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium shadow-sm"
              >
                {t('publish_listing') || "Publish Listing"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('crop') || "Crop"}</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quantity_qtl') || "Quantity (Qtl)"}</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('price_qtl') || "Price/Qtl"}</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type') || "Type"}</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('verification') || "Verification"}</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date') || "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">{t('loading_listings') || "Loading listings..."}</td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">{t('no_listings') || "No listings found. Create one to get started!"}</td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{t(item.cropName) || item.cropName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">₹{item.pricePerQuintal}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'Organic' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {t(item.type) || item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.verificationStatus)}
                      {item.certificateNumber && (
                        <div className="text-xs text-gray-400 mt-1">Ref: {item.certificateNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProduceListings;
