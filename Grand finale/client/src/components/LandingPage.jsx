import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Building2, ArrowRight, Globe, Factory } from 'lucide-react';

const LandingPage = ({ onSelectRole }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 relative">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
        <Globe size={16} className="text-gray-500" />
        <select 
          onChange={(e) => changeLanguage(e.target.value)} 
          className="bg-transparent text-sm text-gray-700 border-none outline-none cursor-pointer"
          defaultValue={i18n.language}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="gu">ગુજરાતી (Gujarati)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="ta">தமிழ் (Tamil)</option>
        </select>
      </div>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('landing_title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('landing_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <button 
            onClick={() => onSelectRole('farmer')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-500 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-green-100 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Sprout size={32} className="text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('role_farmer')}</h2>
              <p className="text-gray-500 mb-6">
                {t('desc_farmer')}
              </p>
              <div className="flex items-center text-green-600 font-bold group-hover:translate-x-2 transition-transform">
                {t('enter_farmer')} <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </button>

          {/* Buyer Card */}
          <button 
            onClick={() => onSelectRole('buyer')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-blue-100 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Building2 size={32} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('role_buyer')}</h2>
              <p className="text-gray-500 mb-6">
                {t('desc_buyer')}
              </p>
              <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                {t('enter_buyer')} <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </button>

          {/* Policymaker Card */}
          <button 
            onClick={() => onSelectRole('policymaker')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-purple-100 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <Globe size={32} className="text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Policymaker</h2>
              <p className="text-gray-500 mb-6">
                Access national dashboards, monitor MSP adherence, and plan logistics.
              </p>
              <div className="flex items-center text-purple-600 font-bold group-hover:translate-x-2 transition-transform">
                Enter Dashboard <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </button>

          {/* Processing Unit Card */}
          <button 
            onClick={() => onSelectRole('processor')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-orange-500 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-orange-100 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <Factory size={32} className="text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Unit</h2>
              <p className="text-gray-500 mb-6">
                Manage oil extraction, quality testing, and batch processing.
              </p>
              <div className="flex items-center text-orange-600 font-bold group-hover:translate-x-2 transition-transform">
                Enter Portal <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </button>

          {/* Traceability Prototype Card */}
          <button 
            onClick={() => onSelectRole('traceability')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-teal-500 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-teal-100 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors">
                <Globe size={32} className="text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Traceability Demo</h2>
              <p className="text-gray-500 mb-6">
                Interactive Blockchain Traceability Prototype (Seed to Consumer).
              </p>
              <div className="flex items-center text-teal-600 font-bold group-hover:translate-x-2 transition-transform">
                Launch Prototype <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </button>
        </div>
        
        {/* Footer removed as requested */}
      </div>
    </div>
  );
};

export default LandingPage;
