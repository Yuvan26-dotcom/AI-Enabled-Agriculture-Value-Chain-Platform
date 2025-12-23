import React, { useEffect, useState } from 'react';
import { 
  Activity, Droplets, Zap, Thermometer, Layers, Sprout, AlertTriangle, 
  CheckCircle, FileText, Download, MapPin, ThumbsUp, ThumbsDown, Info 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTranslation } from 'react-i18next';
import api from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const OILSEED_CROPS = [
  "Soybean", "Groundnut", "Mustard", "Sunflower", "Sesame", 
  "Castor", "Linseed", "Safflower", "Niger", "Rapeseed", "Oil Palm",
  "Taramira", "Toria", "Yellow Sarson"
];

const SoilHealthCard = ({ selectedDistrict, selectedState }) => {
  const { t } = useTranslation();
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Combine suitable and alternative crops for a wider selection of oilseeds
  const allRecommendedCrops = soilData 
    ? [...new Set([...soilData.crops.suitable, ...soilData.crops.alternative])]
    : [];

  const oilseedRecommendations = allRecommendedCrops.filter(crop => 
    OILSEED_CROPS.some(oilseed => crop.toLowerCase().includes(oilseed.toLowerCase()))
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSoilData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/soil/${selectedDistrict}`, {
          params: { state: selectedState }
        });
        setSoilData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch soil data", err);
        setError(t('error_soil_data'));
      } finally {
        setLoading(false);
      }
    };

    if (selectedDistrict) {
      fetchSoilData();
    }
  }, [selectedDistrict, t]);

  if (loading) return <div className="p-8 text-center text-gray-500">{t('loading_soil_data')}</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!soilData) return null;

  // Helper for status colors
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const s = status.toLowerCase();
    if (s.includes('low') || s.includes('deficient')) return 'bg-red-100 text-red-800 border-red-200';
    if (s.includes('high') || s.includes('excess')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusIcon = (status) => {
    if (!status) return <Info size={16} />;
    const s = status.toLowerCase();
    if (s.includes('low') || s.includes('deficient')) return <AlertTriangle size={16} className="text-red-600" />;
    if (s.includes('high')) return <AlertTriangle size={16} className="text-yellow-600" />;
    return <CheckCircle size={16} className="text-green-600" />;
  };

  // Prepare Radar Data (Normalized to 100% of Standard)
  const radarData = [
    { subject: 'Nitrogen', A: Math.min(150, (soilData.nutrients.N / 280) * 100), fullMark: 150 },
    { subject: 'Phosphorus', A: Math.min(150, (soilData.nutrients.P / 20) * 100), fullMark: 150 },
    { subject: 'Potassium', A: Math.min(150, (soilData.nutrients.K / 300) * 100), fullMark: 150 },
    { subject: 'Organic C', A: Math.min(150, (soilData.physical.toc / 0.5) * 100), fullMark: 150 },
    { subject: 'Zinc', A: Math.min(150, (soilData.nutrients.Zn / 0.6) * 100), fullMark: 150 },
    { subject: 'Sulphur', A: Math.min(150, (soilData.nutrients.S / 10) * 100), fullMark: 150 },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 167, 69); // Green color
    doc.text(t('soil_health_card_report'), 105, 15, null, null, "center");
    
    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${t('region')}: ${soilData.location}`, 14, 25);
    doc.text(`${t('soil_type')}: ${t(soilData.core.type)}`, 14, 32);
    doc.text(`${t('date')}: ${new Date().toLocaleDateString()}`, 14, 39);

    // 1. Core Soil Properties
    doc.setFontSize(14);
    doc.setTextColor(40, 167, 69);
    doc.text(t('core_soil_properties'), 14, 50);
    
    autoTable(doc, {
      startY: 55,
      head: [[t('property'), t('value')]],
      body: [
        [t('texture'), soilData.core.texture],
        [t('color'), soilData.core.color],
        [t('organic_matter'), soilData.core.organic_matter],
        [t('ph_level'), `${soilData.nutrients.pH} (${soilData.nutrients.pH > 7.5 ? t('alkaline') : t('neutral')})`],
        [t('electrical_conductivity'), `${soilData.electrical.ec} dS/m`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [40, 167, 69] }
    });

    // 2. Nutrient Status
    doc.text(t('nutrient_status'), 14, doc.lastAutoTable.finalY + 10);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [[t('nutrient'), t('value'), t('status')]],
      body: [
        [t('nitrogen') + ' (N)', `${soilData.nutrients.N} kg/ha`, soilData.nutrients.N < 280 ? t('low') : t('sufficient')],
        [t('phosphorus') + ' (P)', `${soilData.nutrients.P} kg/ha`, t('medium')],
        [t('potassium') + ' (K)', `${soilData.nutrients.K} kg/ha`, t('high')],
        [t('sulphur') + ' (S)', `${soilData.nutrients.S} ppm`, t('deficient')],
        [t('zinc') + ' (Zn)', `${soilData.nutrients.Zn} ppm`, t('deficient')]
      ],
      theme: 'striped',
      headStyles: { fillColor: [40, 167, 69] }
    });

    // 3. Crop Recommendations
    doc.text(t('crop_recommendations'), 14, doc.lastAutoTable.finalY + 10);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [[t('category'), t('crops')]],
      body: [
        [t('suitable_crops'), soilData.crops.suitable.join(', ')],
        [t('alternative_crops'), soilData.crops.alternative.join(', ')],
        [t('crops_to_avoid'), soilData.crops.avoid.join(', ')]
      ],
      theme: 'grid',
      headStyles: { fillColor: [40, 167, 69] },
      columnStyles: { 1: { cellWidth: 130 } } // Wider column for crops list
    });

    // 4. Advisory
    doc.text(t('advisory_suggestions'), 14, doc.lastAutoTable.finalY + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitText = doc.splitTextToSize(
      `${t('fertilizer')}: ${soilData.suggestions.fertilizer}\n` +
      `${t('irrigation')}: ${soilData.suggestions.irrigation}\n` +
      `${t('organic')}: ${soilData.suggestions.organic}`, 
      180
    );
    doc.text(splitText, 14, doc.lastAutoTable.finalY + 15);

    // Save
    doc.save(`${soilData.location}_${soilData.core.type.replace(/ /g, '_')}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 my-6 font-sans">
      {/* Header - Simplified */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Sprout size={32} /> {t('soil_health_card')}
            </h2>
            <p className="text-green-50 text-lg mt-1 flex items-center gap-2">
              <MapPin size={20} /> {soilData.location}
            </p>
          </div>
          <button 
            onClick={generatePDF}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full flex items-center gap-2 transition backdrop-blur-sm"
          >
            <Download size={20} /> <span className="hidden md:inline">{t('save_report')}</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 1. Farmer's Summary - Moved to Top & Simplified */}
        <section className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
          <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
            <Info className="text-green-600" /> {t('quick_summary')}
          </h3>
          <p className="text-green-800 text-lg leading-relaxed">
            {t('your_soil_is')} <strong>{t(soilData.core.type)}</strong> {t('type')}. 
            {soilData.nutrients.N < 280 ? ` ${t('needs_more_nitrogen')} ` : ` ${t('nitrogen_good')} `}
            {t('salt_level_is')} <strong>{soilData.electrical.ec < 1 ? t('normal') : t('high')}</strong>.
            {t('overall_good')} {soilData.crops.suitable[0]}.
          </p>
          <div className="mt-4 p-4 bg-white rounded-xl border border-green-200 flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{t('action_item')}:</h4>
              <p className="text-gray-600">{soilData.suggestions.fertilizer}</p>
            </div>
          </div>
        </section>

        {/* 2. Key Nutrients - Card View instead of Table */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="text-blue-600" /> {t('key_nutrients')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nitrogen */}
            <div className={`p-5 rounded-xl border-2 ${getStatusColor(soilData.nutrients.N < 280 ? 'Low' : 'High')}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold uppercase opacity-70">{t('nitrogen')} (N)</span>
                {getStatusIcon(soilData.nutrients.N < 280 ? 'Low' : 'High')}
              </div>
              <div className="text-3xl font-bold mb-1">{soilData.nutrients.N} <span className="text-sm font-normal">kg/ha</span></div>
              <div className="text-sm font-medium opacity-90">
                {soilData.nutrients.N < 280 ? t('add_urea') : t('sufficient')}
              </div>
            </div>

            {/* Phosphorus */}
            <div className={`p-5 rounded-xl border-2 ${getStatusColor('Medium')}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold uppercase opacity-70">{t('phosphorus')} (P)</span>
                {getStatusIcon('Medium')}
              </div>
              <div className="text-3xl font-bold mb-1">{soilData.nutrients.P} <span className="text-sm font-normal">kg/ha</span></div>
              <div className="text-sm font-medium opacity-90">
                {t('good_level')}
              </div>
            </div>

            {/* Potassium */}
            <div className={`p-5 rounded-xl border-2 ${getStatusColor('High')}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold uppercase opacity-70">{t('potassium')} (K)</span>
                {getStatusIcon('High')}
              </div>
              <div className="text-3xl font-bold mb-1">{soilData.nutrients.K} <span className="text-sm font-normal">kg/ha</span></div>
              <div className="text-sm font-medium opacity-90">
                {t('rich_soil')}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Soil Health Check - Simplified Physical/Electrical */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Droplets className="text-blue-600" /> {t('water_salt_check')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-gray-600">{t('salt_level')}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{soilData.electrical.ec} dS/m</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{t('normal')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-gray-600">{t('ph_level')}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{soilData.nutrients.pH}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{t('alkaline')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-gray-600">{t('water_holding')}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{soilData.physical.water_holding}</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
            <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
              <Layers className="text-orange-600" /> {t('soil_properties')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-orange-100 text-center">
                <span className="block text-xs text-gray-500 uppercase">{t('type')}</span>
                <span className="block font-bold text-gray-800 text-lg">{t(soilData.core.type)}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-orange-100 text-center">
                <span className="block text-xs text-gray-500 uppercase">{t('color')}</span>
                <span className="block font-bold text-gray-800 text-lg">{soilData.core.color}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-orange-100 text-center col-span-2">
                <span className="block text-xs text-gray-500 uppercase">{t('organic_carbon')}</span>
                <span className="block font-bold text-gray-800 text-lg">{soilData.physical.toc}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. What to Grow? - Simplified Recommendations */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sprout className="text-green-600" /> What to Grow?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 relative">
              <div className="flex items-center gap-2 mb-3 text-green-800 font-bold">
                <ThumbsUp size={20} /> {t('best_oilseed_crops')}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {oilseedRecommendations.length > 0 ? (
                  oilseedRecommendations.map(crop => (
                    <span key={crop} className="bg-white px-3 py-1 rounded-full border border-green-200 text-green-800 font-medium shadow-sm">
                      {crop}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm italic">No specific oilseed recommendations for this soil type.</span>
                )}
              </div>
              
              {/* Government Source Badge */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                <img src="https://nfsm.gov.in/images/icon1.png" alt="Gov Emblem" className="h-4 w-4" onError={(e) => e.target.style.display = 'none'} />
                <span className="text-[10px] text-gray-600 font-semibold">
                  Source: NFSM & ICAR (Govt. of India)
                </span>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-yellow-800 font-bold">
                <Info size={20} /> Alternatives
              </div>
              <div className="flex flex-wrap gap-2">
                {soilData.crops.alternative.map(crop => (
                  <span key={crop} className="bg-white px-3 py-1 rounded-full border border-yellow-200 text-yellow-800 font-medium shadow-sm">
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-red-800 font-bold">
                <ThumbsDown size={20} /> Avoid
              </div>
              <div className="flex flex-wrap gap-2">
                {soilData.crops.avoid.map(crop => (
                  <span key={crop} className="bg-white px-3 py-1 rounded-full border border-red-200 text-red-800 font-medium shadow-sm">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Advanced Nutrient Balance Analysis */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 text-white shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-green-400" /> Soil Nutrient Balance Spectrum
            </h3>
            <span className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300 border border-gray-600">
              Normalized to Optimal Levels (100%)
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Radar Chart */}
            <div className="lg:col-span-1 h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#4b5563" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="Nutrient Level"
                    dataKey="A"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="#10b981"
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => [`${Math.round(value)}%`, 'Saturation']}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 text-xs text-gray-500">
                *100% = Optimal
              </div>
            </div>

            {/* Analysis Text */}
            <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="font-bold text-green-400 mb-2 text-sm uppercase tracking-wider">Expert Diagnosis</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The soil analysis indicates a <span className="text-white font-bold">strong Nitrogen-Potassium balance</span>, 
                  ideal for oilseed cultivation. However, the <span className="text-yellow-400 font-bold">Organic Carbon levels are suboptimal</span>, 
                  suggesting a need for increased biomass incorporation. 
                  Micronutrient profile shows <span className="text-red-400 font-bold">Zinc deficiency</span>, 
                  which may limit yield potential if not addressed via foliar sprays.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-green-500">
                  <div className="text-xs text-gray-400 uppercase">Primary Limiting Factor</div>
                  <div className="font-bold text-white">Zinc (Zn) Availability</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-blue-500">
                  <div className="text-xs text-gray-400 uppercase">Yield Potential</div>
                  <div className="font-bold text-white">High (with correction)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SoilHealthCard;
