import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, MapPin, Sprout, Navigation } from 'lucide-react';
import { INDIAN_LOCATIONS } from '../data/locations';

export const ALL_OILSEEDS = [
  'Soybean', 'Groundnut', 'Rapeseed & Mustard', 'Sunflower', 'Sesame', 
  'Castor', 'Safflower', 'Niger', 'Linseed', 'Oil Palm', 'Coconut', 'Cottonseed'
];

const DashboardHeader = ({ selectedState, setSelectedState, selectedCrop, setSelectedCrop, selectedDistrict, setSelectedDistrict }) => {
  const { t } = useTranslation();

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    
    // Automatically reset district to the first valid option
    if (INDIAN_LOCATIONS[newState]?.length > 0 && setSelectedDistrict) {
      setSelectedDistrict(INDIAN_LOCATIONS[newState][0]);
    }
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
           {t('price_decision_cockpit')}
        </h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">
            {t('live_market_data')}
          </span>
          {t('for')} {selectedDistrict ? `${selectedDistrict}, ` : ''}{selectedState}
        </p>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        
        {/* State Filter Pill */}
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:border-green-500 transition-colors">
            <MapPin size={16} className="text-gray-500" />
            <span className="text-xs font-bold text-gray-500 uppercase">{t('state_label')}</span>
            <select 
                value={selectedState}
                onChange={handleStateChange}
                className="bg-transparent text-gray-800 font-bold text-sm focus:outline-none cursor-pointer min-w-[120px]"
            >
                {Object.keys(INDIAN_LOCATIONS).map(state => (
                    <option key={state} value={state}>{t(state)}</option>
                ))}
            </select>
        </div>

        {/* District Filter Pill */}
        {setSelectedDistrict && INDIAN_LOCATIONS[selectedState] && (
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:border-green-500 transition-colors">
              <Navigation size={16} className="text-gray-500" />
              <span className="text-xs font-bold text-gray-500 uppercase">{t('dist_label')}</span>
              <select 
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="bg-transparent text-gray-800 font-bold text-sm focus:outline-none cursor-pointer min-w-[100px]"
              >
                  {INDIAN_LOCATIONS[selectedState].map(dist => (
                      <option key={dist} value={dist}>{t(dist)}</option>
                  ))}
              </select>
          </div>
        )}

        {/* Crop Filter Pill */}
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:border-green-500 transition-colors">
            <Sprout size={16} className="text-green-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">{t('crop_label')}</span>
            <select 
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-transparent text-green-700 font-bold text-sm focus:outline-none cursor-pointer min-w-[100px]"
            >
                {ALL_OILSEEDS.map(crop => (
                    <option key={crop} value={crop}>{t(crop)}</option>
                ))}
            </select>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
