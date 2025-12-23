import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, TrendingDown, Sun, IndianRupee, Droplets, Volume2
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import ProductionAnalytics from './ProductionAnalytics';
import PriceTrendChart from './PriceTrendChart';
import PriceForecast from './PriceForecast';
import SmartCropAdvisor from './SmartCropAdvisor';
import CropDistributionChart from './CropDistributionChart';
import GamificationWidget from './GamificationWidget';
import SoilHealthCard from './SoilHealthCard';

const districtCoordinates = {
  'Indore': { lat: 22.7196, lon: 75.8577 },
  'Bhopal': { lat: 23.2599, lon: 77.4126 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Nagpur': { lat: 21.1458, lon: 79.0882 },
  'Ujjain': { lat: 23.1765, lon: 75.7885 },
  'Dewas': { lat: 22.9676, lon: 76.0534 },
  'Sehore': { lat: 23.2030, lon: 77.0844 },
  'Vidisha': { lat: 23.5251, lon: 77.8081 },
  'Rajgarh': { lat: 24.0093, lon: 76.7258 },
  'Harda': { lat: 22.3398, lon: 76.9863 },
  'Betul': { lat: 21.9008, lon: 77.9011 },
  'Hoshangabad': { lat: 22.7519, lon: 77.7289 },
  'Raisen': { lat: 23.3342, lon: 77.7918 },
  'Dhar': { lat: 22.5971, lon: 75.3001 },
  'Jhabua': { lat: 22.7698, lon: 74.5909 },
  'Alirajpur': { lat: 22.3035, lon: 74.3525 },
  'Barwani': { lat: 22.0369, lon: 74.9037 },
  'Khargone': { lat: 21.8214, lon: 75.6188 },
  'Khandwa': { lat: 21.8314, lon: 76.3498 },
  'Burhanpur': { lat: 21.3105, lon: 76.2126 },
  'Agar Malwa': { lat: 23.7165, lon: 76.0165 },
  'Shajapur': { lat: 23.4314, lon: 76.2763 },
  'Ratlam': { lat: 23.3315, lon: 75.0367 },
  'Mandsaur': { lat: 24.0722, lon: 75.0680 },
  'Neemuch': { lat: 24.4778, lon: 74.8749 }
};

const Dashboard = ({ 
  onNavigate, 
  selectedState, 
  setSelectedState, 
  selectedDistrict, 
  setSelectedDistrict, 
  selectedCrop,
  setSelectedCrop,
  voiceMode,
  speak
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [livePrice, setLivePrice] = useState(null);
  const [weather, setWeather] = useState(null);
  
  const coords = districtCoordinates[selectedDistrict] || { lat: 22.7196, lon: 75.8577 };

  // Real-time Weather Data (Open-Meteo API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
        );
        const data = await response.json();
        
        // WMO Weather Code Interpretation
        const getCondition = (code) => {
          if (code === 0) return t('weather_clear_sky');
          if (code === 1 || code === 2 || code === 3) return t('weather_partly_cloudy');
          if (code >= 45 && code <= 48) return t('weather_foggy');
          if (code >= 51 && code <= 67) return t('weather_rainy');
          if (code >= 71 && code <= 77) return t('weather_snowy');
          if (code >= 80 && code <= 82) return t('weather_heavy_rain');
          if (code >= 95) return t('weather_thunderstorm');
          return t('weather_clear_sky');
        };

        setWeather({
          temp: data.current_weather.temperature,
          wind: data.current_weather.windspeed,
          condition: getCondition(data.current_weather.weathercode)
        });
      } catch (error) {
        console.error("Weather fetch failed:", error);
        setWeather({ temp: 24, condition: t('weather_clear_offline') });
      }
    };

    fetchWeather();
  }, [selectedDistrict, t]);

  // Price Simulation Ticker
  useEffect(() => {
    const simulatePrice = () => {
        setLivePrice({
          current: 4500 + Math.random() * 200,
          change: +(Math.random() * 5).toFixed(2),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        });
        setLoading(false);
    };

    simulatePrice();
    const interval = setInterval(simulatePrice, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSpeak = (text) => {
    if (speak) speak(text);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Dynamic Mapping */}
      <DashboardHeader 
        user={{ name: "Farmer", role: "farmer" }}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedCrop={selectedCrop}
        setSelectedCrop={setSelectedCrop}
      />

      {/* Real-Time Ticker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price Card */}
        <div 
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 flex flex-col justify-between cursor-pointer hover:bg-green-50 transition-colors"
            onClick={() => handleSpeak(t('voice_price_info', { crop: selectedCrop, price: livePrice?.current.toFixed(0), trend: t(livePrice?.trend === 'up' ? 'trend_up' : 'trend_down') }))}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">{t('mandi_price') || "Mandi Price"} ({selectedCrop})</p>
              <h3 className="text-4xl font-bold text-green-700 flex items-center mt-2">
                <IndianRupee size={32} /> {livePrice?.current.toFixed(0)}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${livePrice?.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {livePrice?.trend === 'up' ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
            </div>
          </div>
          {voiceMode && <div className="mt-4 flex items-center text-green-600 text-sm font-bold"><Volume2 size={16} className="mr-1"/> {t('tap_to_listen')}</div>}
        </div>

        {/* Weather Card */}
        <div 
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex flex-col justify-between cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => handleSpeak(t('voice_weather_info', { temp: weather?.temp.toFixed(0), condition: weather?.condition }))}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">{t('weather') || "Weather"}</p>
              <h3 className="text-4xl font-bold text-gray-800 mt-2">{weather?.temp.toFixed(0)}°C</h3>
              <p className="text-gray-600 mt-1">{weather?.condition}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Sun size={32} />
            </div>
          </div>
          {voiceMode && <div className="mt-4 flex items-center text-blue-600 text-sm font-bold"><Volume2 size={16} className="mr-1"/> {t('tap_to_listen')}</div>}
        </div>


      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trend Chart (Agmarknet Data) */}
        <PriceTrendChart selectedCrop={selectedCrop} />

        {/* AI Price Forecast */}
        <PriceForecast selectedCrop={selectedCrop} selectedState={selectedState} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Crop Advisor (MSP & Yield) */}
        <SmartCropAdvisor 
          selectedCrop={selectedCrop} 
          selectedDistrict={selectedDistrict}
          currentMarketPrice={livePrice?.current}
        />

        {/* Crop Distribution Pie Chart */}
        <CropDistributionChart selectedState={selectedState} selectedDistrict={selectedDistrict} />
      </div>

      {/* Windy Weather Forecast */}
      <div className="bg-white p-4 rounded-xl shadow-md overflow-hidden">
        <h3 className="text-lg font-bold text-gray-700 mb-4">{t('live_weather_forecast') || "Live Weather Forecast (Windy)"}</h3>
        <iframe 
          width="100%" 
          height="400" 
          src={`https://embed.windy.com/embed2.html?lat=${coords.lat}&lon=${coords.lon}&detailLat=${coords.lat}&detailLon=${coords.lon}&width=650&height=450&zoom=10&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`} 
          frameBorder="0"
          title="Windy Weather"
        ></iframe>
      </div>

      {/* Soil Health Card Feature */}
      <SoilHealthCard selectedDistrict={selectedDistrict} selectedState={selectedState} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Production Analytics removed as per request */}
        </div>

        {/* Right Column: Alerts */}
        <div className="space-y-6">
          <GamificationWidget />
          <div 
            className="bg-green-50 p-6 rounded-xl border-2 border-green-200 cursor-pointer hover:bg-green-100"
            onClick={() => handleSpeak(t('voice_sell_advice'))}
          >
            <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2 text-xl">
              <IndianRupee size={24} /> {t('sell_now') || "Sell Now?"}
            </h3>
            <p className="text-lg text-green-700 mb-4">
              {t('prices_good_today') || "Prices are good today."}
            </p>
            <button 
                onClick={(e) => { e.stopPropagation(); onNavigate('contracts'); }}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:bg-green-700"
            >
              {t('sell_crop') || "Sell Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
