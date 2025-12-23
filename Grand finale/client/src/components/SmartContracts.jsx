import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, IndianRupee, Scale, Truck, User, Volume2, RefreshCw, X, ShieldCheck } from 'lucide-react';
import api from '../api';

const SmartContracts = ({ initialState, voiceMode, speak }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState('offer'); // offer, quantity, success
  const [quantity, setQuantity] = useState('');
  const [isOrganic, setIsOrganic] = useState(false);
  const [marketPrice, setMarketPrice] = useState(4850); // Default fallback
  
  // Verification State
  const [showVerification, setShowVerification] = useState(false);
  const [certNumber, setCertNumber] = useState('');
  const [verificationMsg, setVerificationMsg] = useState('');

  // Fetch dynamic price set by FPO
  useEffect(() => {
    if (initialState?.suggestedPrice) {
      setMarketPrice(Number(initialState.suggestedPrice));
    }
  }, [initialState]);

  // Hardcoded "Best Offer" for simplicity
  const organicPremium = 1200;
  const currentPrice = isOrganic ? marketPrice + organicPremium : marketPrice;

  const bestOffer = {
    buyer: "Open Market (FPO Managed)",
    price: currentPrice,
    crop: initialState?.crop || "Soybean",
    distance: "Local Mandi"
  };

  const handleSpeak = (text) => {
      if (voiceMode && speak) {
          speak(text);
      }
  };

  const handleSellClick = () => {
    handleSpeak(t('voice_enter_quantity'));
    setStep('quantity');
  };

  const handleOrganicToggle = (e) => {
      if (e.target.checked) {
          setShowVerification(true);
          handleSpeak("Please enter your organic certificate number for verification.");
      } else {
          setIsOrganic(false);
          setVerificationMsg('');
      }
  };

  const verifyOrganicUser = () => {
      if (certNumber.toUpperCase().startsWith('ORG')) {
          setIsOrganic(true);
          setShowVerification(false);
          setVerificationMsg('');
          handleSpeak("Verification Successful. Organic Premium Applied.");
      } else {
          setVerificationMsg("Invalid Certificate Number. Please try again.");
          handleSpeak("Invalid Certificate Number.");
      }
  };

  const handleConfirm = async () => {
    if (!quantity) return;
    
    try {
      await api.post('/produce', {
        cropName: bestOffer.crop,
        quantity: quantity,
        pricePerQuintal: bestOffer.price,
        type: isOrganic ? 'Organic' : 'Conventional',
        certificateNumber: isOrganic ? certNumber : null
      });

      handleSpeak(t('voice_selling_confirm', { quantity, buyer: bestOffer.buyer }));
      setStep('success');
    } catch (err) {
      console.error("Failed to post listing", err);
      // alert("Failed to post listing. Please try again."); // Removed alert to be "loopless" / less intrusive
    }
  };

  const totalValue = quantity ? (parseFloat(quantity) * bestOffer.price).toFixed(0) : 0;

  return (
    <div className="p-4 max-w-2xl mx-auto min-h-screen relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {step !== 'offer' && (
          <button onClick={() => setStep('offer')} className="p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-2xl font-bold text-white">{t('sell_your_crop')}</h1>
        <button onClick={() => handleSpeak(t('voice_selling_page'))} className="ml-auto p-2 bg-gray-700 rounded-full text-yellow-400 hover:bg-gray-600">
            <Volume2 size={24} />
        </button>
      </div>

      {/* Step 1: The Offer */}
      {step === 'offer' && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-green-400 font-bold uppercase text-sm tracking-wider">{t('best_buyer')}</p>
                <h2 className="text-3xl font-bold text-white mt-1">{bestOffer.buyer}</h2>
                <p className="text-lg font-semibold text-yellow-400 mt-1">Crop: {bestOffer.crop}</p>
                <p className="text-gray-400 flex items-center gap-1 mt-2 text-sm">
                  <Truck size={16} className="text-green-400" /> {bestOffer.distance} {t('distance')}
                </p>
              </div>
              <div className="bg-gray-700 p-3 rounded-full text-green-400">
                <User size={32} />
              </div>
            </div>
            
            {/* Organic Toggle with Verification */}
            <div className="mb-4 flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
                <input 
                    type="checkbox" 
                    id="organicCheck" 
                    checked={isOrganic} 
                    onChange={handleOrganicToggle}
                    className="w-5 h-5 text-green-500 rounded focus:ring-green-500 bg-gray-600 border-gray-500"
                />
                <label htmlFor="organicCheck" className="text-gray-200 font-bold text-sm cursor-pointer select-none flex-1">
                    I am an Organic Certified Farmer
                </label>
                {isOrganic && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <ShieldCheck size={12} /> Verified
                    </span>
                )}
            </div>

            <div className="bg-gray-700 p-4 rounded-xl mb-6">
              <p className="text-center text-gray-300 font-bold mb-1 text-sm uppercase tracking-wide">Today's Price {isOrganic && '(Organic)'}</p>
              <div className="flex justify-center items-center text-white">
                <IndianRupee size={32} className="text-green-400" />
                <span className="text-5xl font-bold">{bestOffer.price}</span>
                <span className="text-xl text-gray-400 ml-2 font-medium">/ Qtl</span>
              </div>
              
              {/* Last Year Price Comparison - Fixed ReferenceError */}
              <div className="mt-3 pt-3 border-t border-gray-600 flex justify-between items-center px-4">
                 <span className="text-gray-400 font-medium text-sm">Last Year Price {isOrganic && '(Organic)'}:</span>
                 <span className="text-white font-bold">₹{(marketPrice - 380) + (isOrganic ? organicPremium : 0)} / Qtl</span>
              </div>
            </div>

            <button 
              onClick={handleSellClick}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-2xl shadow-lg hover:bg-green-500 transition-colors"
            >
              Sell Now
            </button>
          </div>

          {/* Useful Links Section */}
          <div className="bg-gray-800 p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-gray-200 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Volume2 size={16} className="text-blue-400" /> Useful Government Links
            </h3>
            <div className="flex flex-wrap gap-3">
                <a href="https://enam.gov.in/web/" target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-700 text-blue-300 rounded-full text-sm font-medium hover:bg-gray-600 hover:text-blue-200 transition-colors">
                  eNAM Portal
                </a>
                <a href="https://agmarknet.gov.in/" target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-700 text-blue-300 rounded-full text-sm font-medium hover:bg-gray-600 hover:text-blue-200 transition-colors">
                  Agmarknet Prices
                </a>
                <a href="https://nfsm.gov.in/" target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-700 text-blue-300 rounded-full text-sm font-medium hover:bg-gray-600 hover:text-blue-200 transition-colors">
                  NFSM India
                </a>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-blue-900/30 p-2 rounded-full text-blue-400">
              <Scale size={24} />
            </div>
            <div>
              <p className="font-bold text-blue-200">Fair Weight Guarantee</p>
              <p className="text-sm text-blue-300/80">Digital weighing scale used.</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Quantity */}
      {step === 'quantity' && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <label className="block text-gray-300 font-bold mb-4 text-xl text-center">{t('enter_quantity')}</label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full text-5xl p-6 bg-gray-700 border-2 border-gray-600 rounded-xl focus:outline-none focus:border-green-500 font-bold text-center text-white placeholder-gray-500 transition-colors"
              placeholder="0"
              autoFocus
            />
            
            {quantity && (
              <div className="mt-6 bg-gray-700 p-6 rounded-xl text-center">
                <p className="text-green-300 text-sm uppercase tracking-wider mb-2">Total Money You Get</p>
                <p className="text-4xl font-bold text-white flex justify-center items-center gap-1">
                  <IndianRupee size={32} className="text-green-400" /> {totalValue}
                </p>
              </div>
            )}

            <button 
              onClick={handleConfirm}
              disabled={!quantity}
              className={`w-full mt-8 py-4 rounded-xl font-bold text-2xl shadow-lg transition-colors ${quantity ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
            >
              {t('confirm_sale')}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 'success' && (
        <div className="text-center space-y-8 pt-10">
          <div className="inline-flex bg-green-900/30 p-8 rounded-full text-green-400 mb-4">
            <CheckCircle size={80} />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">{t('sale_confirmed')}</h2>
            <p className="text-xl text-gray-300">
              Truck will arrive tomorrow morning.
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl shadow-md max-w-sm mx-auto">
            <p className="text-gray-400 text-sm uppercase tracking-wider">Expected Payment</p>
            <h3 className="text-5xl font-bold text-white my-4">₹ {totalValue}</h3>
            <p className="text-sm text-green-300 bg-green-900/30 py-1.5 px-4 rounded-full inline-block font-medium">
              {t('money_sent')}
            </p>
          </div>

          <button 
            onClick={() => setStep('offer')}
            className="bg-gray-700 text-white px-10 py-3 rounded-xl font-bold text-lg hover:bg-gray-600 transition-colors"
          >
            Done
          </button>
        </div>
      )}

      {/* Verification Modal */}
      {showVerification && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4 rounded-xl backdrop-blur-sm">
              <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="text-green-500" /> Verify Organic
                      </h3>
                      <button onClick={() => setShowVerification(false)} className="text-gray-400 hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <p className="text-gray-300 mb-4 text-sm">
                      Enter your Organic Certificate Number to claim the premium price.
                  </p>

                  <input 
                      type="text" 
                      placeholder="Ex: ORG-2024-XXXX"
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-2 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  
                  {verificationMsg && (
                      <p className="text-orange-400 text-sm mb-3 font-medium flex items-center gap-1">
                          {verificationMsg}
                      </p>
                  )}

                  <button 
                      onClick={verifyOrganicUser}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-500 transition-colors mt-2"
                  >
                      Verify & Apply
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default SmartContracts;
