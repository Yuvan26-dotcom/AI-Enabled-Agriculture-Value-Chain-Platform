import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InventoryProvider } from './context/InventoryContext';
import SmartContracts from './components/SmartContracts';
import CreditFacilitation from './components/CreditFacilitation';
import LogisticsDashboard from './components/LogisticsDashboard';
import TraceabilityExplorer from './components/TraceabilityExplorer';
import AgmarknetTicker from './components/AgmarknetTicker';
import SignupForm from './components/SignupForm';
import HarvestDeclarationModal from './components/HarvestDeclarationModal';
import Dashboard from './components/Dashboard';
import ProduceListings from './components/ProduceListings';
import BuyerBidsTable from './components/BuyerBidsTable';
import { LayoutDashboard, FileText, Truck, Bug, QrCode, User, IndianRupee, LogOut, Volume2, Home, ShoppingBag, Sprout, Gavel } from 'lucide-react';

const FarmerApp = ({ onLogout, user }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabData, setTabData] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  // Shared State for Context (Lifted from Dashboard)
  const [selectedState, setSelectedState] = useState(user?.location?.state || 'Madhya Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState(user?.location?.district || 'Indore');
  const [selectedCrop, setSelectedCrop] = useState('Soybean');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    
    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Text to Speech Helper
  const speak = (text) => {
    if (!voiceMode) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Fetch voices directly to ensure we have the latest list
    const currentVoices = window.speechSynthesis.getVoices();

    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'bn': 'bn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'or': 'or-IN',
      'ur': 'ur-IN',
      'as': 'as-IN'
    };

    // Handle both 'hi' and 'hi-IN' style codes
    const currentLang = i18n.language;
    const baseLang = currentLang.split('-')[0];
    const targetLang = langMap[baseLang] || langMap[currentLang] || 'en-US';
    
    console.log(`Speaking: "${text}" in ${targetLang} (Requested: ${currentLang})`);

    // 1. Try exact match (e.g., 'hi-IN')
    let voice = currentVoices.find(v => v.lang === targetLang);
    
    // 2. Try partial match (e.g., 'hi')
    if (!voice) {
      voice = currentVoices.find(v => v.lang.startsWith(baseLang));
    }

    // 3. Fallback to Google/Microsoft specific voices if available (common in Chrome/Edge)
    if (!voice) {
       // Try finding by name (e.g. "Tamil", "Hindi")
       const langNames = {
           'ta': 'Tamil',
           'hi': 'Hindi',
           'te': 'Telugu',
           'mr': 'Marathi',
           'gu': 'Gujarati',
           'kn': 'Kannada',
           'bn': 'Bengali',
           'ml': 'Malayalam'
       };
       const langName = langNames[baseLang];
       if (langName) {
           voice = currentVoices.find(v => v.name.includes(langName));
       }
    }

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      console.log(`Using voice: ${voice.name} (${voice.lang})`);
    } else {
      // Fallback to English if no voice found for the language
      console.warn(`No voice found for ${targetLang}, falling back to English`);
      utterance.lang = 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (voiceMode) {
      speak(t('welcome_message') || "Welcome to OilSeeds AI. Select a tab to begin.");
    }
  }, [voiceMode]);

  // Speak when language changes
  useEffect(() => {
    if (voiceMode) {
      // Small delay to ensure translation is loaded
      setTimeout(() => {
        speak(t('language_changed') || "Language changed");
      }, 500);
    }
  }, [i18n.language]);

  // Load state from URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
      
      // Restore tabData from URL params if applicable
      const crop = params.get('crop');
      const price = params.get('price');
      if (crop && price) {
        setTabData({ crop, suggestedPrice: price });
      }
    }
  }, []);

  const handleAcceptBid = (bid) => {
    // Logic to accept bid (e.g., create contract)
    console.log("Accepted bid:", bid);
    // Navigate to contracts with pre-filled data
    setTabData({ 
        crop: bid.crop, 
        price: bid.price, 
        buyer: bid.buyer,
        quantity: bid.qty 
    });
    setActiveTab('contracts');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleNavigate = (tab, data = null) => {
    setTabData(data);
    setActiveTab(tab);
    
    // Voice feedback
    if (voiceMode) {
        const labels = {
            'dashboard': 'voice_nav_dashboard',
            'contracts': 'voice_nav_contracts',
            'credit': 'voice_nav_credit',
            'logistics': 'voice_nav_logistics'
        };
        const key = labels[tab];
        const text = key ? t(key) : tab;
        speak(`${t('opening')} ${text}`);
    }
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    if (data && data.crop) {
      url.searchParams.set('crop', data.crop);
      url.searchParams.set('price', data.suggestedPrice);
    }
    window.history.pushState({}, '', url);
  };

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {showSignup && <SignupForm onClose={() => setShowSignup(false)} />}
        
        {/* Header */}
        <header className="bg-green-700 text-white p-4 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2" onClick={() => voiceMode && speak(t('app_title_voice'))}>
              <div className="bg-white p-2 rounded-full">
                <img src="/logo.svg" alt="Logo" className="w-8 h-8" onError={(e) => e.target.style.display = 'none'} />
                <span className="text-green-700 font-bold text-2xl">OilSeeds.AI</span>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
               {/* Voice Mode Toggle */}
               <button 
                onClick={() => setVoiceMode(!voiceMode)}
                className={`p-2 rounded-full ${voiceMode ? 'bg-yellow-400 text-black' : 'bg-green-800 text-white'} border border-white/20`}
                title="Voice Assistant"
              >
                <Volume2 size={24} />
              </button>

              <div className="hidden md:block text-right mr-2">
                  <p className="font-bold text-sm">{user?.name || 'Farmer'}</p>
                  <p className="text-xs text-green-200">{user?.location?.district || 'Indore'}, {user?.location?.state || 'MP'}</p>
               </div>

              <select 
                onChange={(e) => changeLanguage(e.target.value)}  
                className="bg-green-800 text-white text-lg rounded px-3 py-2 border-none outline-none cursor-pointer hover:bg-green-600"
                defaultValue="en"
                value={i18n.language}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
                <option value="as">অসমীয়া (Assamese)</option>
                <option value="ur">اردو (Urdu)</option>
              </select>
              <button 
                onClick={onLogout}
                className="ml-2 px-3 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 flex items-center gap-1 text-lg"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Live Ticker */}
        <AgmarknetTicker />

        {/* Main Content */}
        <main className="container mx-auto p-4">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => handleNavigate('dashboard')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl shadow-sm transition-all ${activeTab === 'dashboard' ? 'bg-green-600 text-white scale-105 ring-4 ring-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <Home size={32} /> 
              <span className="font-bold text-lg">{t('voice_nav_dashboard')}</span>
            </button>
            <button 
              onClick={() => handleNavigate('contracts')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl shadow-sm transition-all ${activeTab === 'contracts' ? 'bg-green-600 text-white scale-105 ring-4 ring-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <ShoppingBag size={32} /> 
              <span className="font-bold text-lg">{t('voice_nav_contracts')}</span>
            </button>
            <button 
              onClick={() => handleNavigate('produce')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl shadow-sm transition-all ${activeTab === 'produce' ? 'bg-green-600 text-white scale-105 ring-4 ring-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <Sprout size={32} /> 
              <span className="font-bold text-lg">Produce</span>
            </button>
            <button 
              onClick={() => handleNavigate('bids')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl shadow-sm transition-all ${activeTab === 'bids' ? 'bg-green-600 text-white scale-105 ring-4 ring-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <Gavel size={32} /> 
              <span className="font-bold text-lg">Buyer Bids</span>
            </button>
            <button 
              onClick={() => handleNavigate('credit')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl shadow-sm transition-all ${activeTab === 'credit' ? 'bg-green-600 text-white scale-105 ring-4 ring-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <IndianRupee size={32} /> 
              <span className="font-bold text-lg">{t('voice_nav_credit')}</span>
            </button>
            <button 
              onClick={() => handleNavigate('logistics')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl shadow-sm transition-all ${activeTab === 'logistics' ? 'bg-green-600 text-white scale-105 ring-4 ring-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <Truck size={32} /> 
              <span className="font-bold text-lg">{t('voice_nav_logistics')}</span>
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <Dashboard 
              onNavigate={handleNavigate} 
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedCrop={selectedCrop}
              setSelectedCrop={setSelectedCrop}
              voiceMode={voiceMode}
              speak={speak}
            />
          )}

          {activeTab === 'contracts' && (
            <SmartContracts initialState={tabData} voiceMode={voiceMode} speak={speak} />
          )}

          {activeTab === 'produce' && (
            <ProduceListings voiceMode={voiceMode} speak={speak} />
          )}

          {activeTab === 'bids' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Active Buyer Bids</h2>
                <p className="text-gray-600">View and accept bids from corporate buyers for your produce.</p>
              </div>
              <BuyerBidsTable 
                onAcceptBid={handleAcceptBid}
                selectedState={selectedState}
                selectedCrop={selectedCrop}
                selectedDistrict={selectedDistrict}
              />
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="space-y-6">
                <CreditFacilitation initialState={tabData} voiceMode={voiceMode} speak={speak} />
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-6">
                {/* <LogisticsMap /> */}
                <LogisticsDashboard 
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                  selectedCrop={selectedCrop}
                  setSelectedCrop={setSelectedCrop}
                  voiceMode={voiceMode}
                  speak={speak}
                />
            </div>
          )}

          {activeTab === 'traceability' && (
            <div className="space-y-6">
                <TraceabilityExplorer voiceMode={voiceMode} speak={speak} />
                {/* <TraceabilityWidget /> */}
            </div>
          )}
          
          {showHarvestModal && <HarvestDeclarationModal onClose={() => setShowHarvestModal(false)} />}
        </main>
      </div>
    </InventoryProvider>
  );
};

export default FarmerApp;
