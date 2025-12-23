import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventory } from '../context/InventoryContext';
import { 
  TrendingUp, Sprout, 
  Cpu, Landmark, Umbrella, CheckCircle2,
  ExternalLink, Building2, FileText, ArrowRight, Volume2
} from 'lucide-react';

const CreditFacilitation = ({ initialState, voiceMode, speak }) => {
  const { t } = useTranslation();
  const { getActiveLoan } = useInventory();
  
  // --- State Management ---
  const [analyzing, setAnalyzing] = useState(false);
  const [proposal, setProposal] = useState(null);
  
  // User Inputs
  const [cropType, setCropType] = useState('Soybean');
  const [landSize, setLandSize] = useState(5.0); // Acres
  const [insuranceOptIn, setInsuranceOptIn] = useState(true);
  const [smartProtocol, setSmartProtocol] = useState(true);

  const handleSpeak = (text) => {
    if (voiceMode && speak) {
      speak(text);
    }
  };

  // Mock Agri-Stack Data (Simulated Backend Fetch)
  const agriStackData = {
    soilHealth: t('high_organic_carbon') || "High Organic Carbon",
    historicalYield: t('top_20_district') || "Top 20% in District",
    riskProfile: t('low_irrigated') || "Low (Irrigated Land)"
  };

  // Realistic Scale of Finance (2024-25 Estimates per Acre)
  const SCALE_OF_FINANCE = {
    'Soybean': 55000 / 2.47,
    'Mustard': 45000 / 2.47,
    'Groundnut': 50000 / 2.47,
    'Wheat': 40000 / 2.47,
    'Maize': 35000 / 2.47
  };

  // --- Smart Credit Engine Logic ---
  const generateProposal = () => {
    setAnalyzing(true);
    handleSpeak(t('analyzing_credit') || "Analyzing credit eligibility...");

    setTimeout(() => {
      // 1. Base Calculations (KCC Limit)
      const scale = SCALE_OF_FINANCE[cropType] || (50000 / 2.47);
      const baseLoan = scale * landSize;

      // 2. Performance Incentives
      let performanceBonus = 0;
      let interestSubsidy = 0;

      // Incentive: Oilseed Production (Import Substitution)
      if (['Soybean', 'Mustard', 'Groundnut', 'Oil Palm'].includes(cropType)) {
        performanceBonus += baseLoan * 0.10; // 10% Bonus for Oilseeds
      }

      // Incentive: Smart Farming Protocol (Advisory Adherence)
      if (smartProtocol) {
        interestSubsidy += 3.0; // 3% Interest Subvention (Govt Scheme)
      }

      // 3. Insurance Calculation (PMFBY)
      const sumInsured = baseLoan * 1.2; // 120% of Loan
      const premiumRate = 0.02; // 2% for Kharif/Rabi Oilseeds
      const insurancePremium = sumInsured * premiumRate;

      // 4. Final Scoring
      const score = smartProtocol ? 850 : 720; // Mock Credit Score

      setProposal({
        score,
        loanDetails: {
          scheme: t('kcc_scheme') || "Kisan Credit Card (KCC)",
          baseAmount: baseLoan,
          bonusAmount: performanceBonus,
          totalLimit: baseLoan + performanceBonus,
          baseRate: 7.0,
          subvention: interestSubsidy,
          effectiveRate: 7.0 - interestSubsidy, // 7% Base - 3% Govt Subvention = 4%
        },
        insurance: {
          covered: insuranceOptIn,
          sumInsured: sumInsured,
          premium: insurancePremium,
          provider: t('aic_provider') || "AIC of India (PMFBY)"
        },
        incentives: [
          { name: t('kcc_limit_enhancement') || "KCC Limit Enhancement", value: t('extra_oilseeds') || "10% Extra (Oilseeds)", active: true },
          { name: t('prompt_repayment_incentive') || "Prompt Repayment Incentive", value: t('interest_subvention_3') || "3% Interest Subvention", active: smartProtocol },
          { name: t('digital_health_card_bonus') || "Digital Health Card Bonus", value: t('instant_approval') || "Instant Approval", active: true }
        ]
      });
      setAnalyzing(false);
      handleSpeak(t('credit_proposal_ready') || "Credit proposal generated successfully.");
    }, 1500);
  };

  const handleRedirect = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-12">
      {/* Professional Banking Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <Landmark className="text-green-700" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('credit_facilitation_console') || "Credit Facilitation Console"}</h1>
            <p className="text-gray-500 text-sm">{t('integrated_jansamarth') || "Integrated with JanSamarth & AgriStack"}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={() => handleRedirect('https://www.jansamarth.in/')}
             className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors border border-blue-200"
           >
             <ExternalLink size={16} /> {t('jansamarth_portal') || "JanSamarth Portal"}
           </button>
           <button 
             onClick={() => handleRedirect('https://pmfby.gov.in/')}
             className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors border border-green-200"
           >
             <ExternalLink size={16} /> {t('pmfby_insurance') || "PMFBY Insurance"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Application Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" /> {t('application_details') || "Application Details"}
                </h3>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{t('step_1_of_2') || "Step 1 of 2"}</span>
            </div>
            
            <div className="space-y-5">
              {/* Crop Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('primary_crop') || "Primary Crop"}</label>
                <select 
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 transition-all"
                >
                  <option value="Soybean">{t('soybean') || "Soybean (Yellow Gold)"}</option>
                  <option value="Mustard">{t('mustard') || "Mustard / Rapeseed"}</option>
                  <option value="Groundnut">{t('groundnut') || "Groundnut"}</option>
                  <option value="Oil Palm">{t('oil_palm') || "Oil Palm (NMEO Special)"}</option>
                  <option value="Sunflower">{t('sunflower') || "Sunflower"}</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">{t('scale_of_finance_note') || "Scale of Finance varies by crop."}</p>
              </div>

              {/* Land Size Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-bold text-gray-700">{t('land_holding') || "Land Holding (Acres)"}</label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{landSize} {t('acres') || "Acres"}</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="25"
                  step="0.5"
                  value={landSize}
                  onChange={(e) => setLandSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Smart Protocol Toggle */}
              <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${smartProtocol ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                   onClick={() => setSmartProtocol(!smartProtocol)}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${smartProtocol ? 'bg-green-500 border-green-500' : 'border-gray-400 bg-white'}`}>
                    {smartProtocol && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{t('prompt_repayment_pledge') || "Prompt Repayment Pledge"}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {t('pledge_text') || "I pledge to repay the loan within the due date to avail the"} <strong>{t('interest_subvention_3') || "3% Interest Subvention"}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insurance Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Umbrella size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-800 block">{t('pmfby_insurance') || "PMFBY Insurance"}</span>
                    <span className="text-xs text-gray-500">{t('premium_rate') || "Premium: 2% of Sum Insured"}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setInsuranceOptIn(!insuranceOptIn)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${insuranceOptIn ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${insuranceOptIn ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <button 
                onClick={generateProposal}
                disabled={analyzing}
                className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {analyzing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('verifying_records') || "Verifying Records..."}
                    </>
                ) : (
                    <>
                        {t('check_eligibility') || "Check Eligibility"} <ArrowRight size={18} />
                    </>
                )}
              </button>
            </div>
          </div>

          {/* Agri-Stack Data Preview */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('verified_data_source') || "Verified Data Source: Agri-Stack"}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600 flex items-center gap-2"><Sprout size={14} /> {t('soil_health') || "Soil Health"}</span>
                <span className="font-medium text-green-700 bg-green-50 px-2 py-1 rounded">{agriStackData.soilHealth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2"><TrendingUp size={14} /> {t('yield_history') || "Yield History"}</span>
                <span className="font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">{agriStackData.historicalYield}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Dashboard */}
        <div className="lg:col-span-8">
          {!proposal && !analyzing && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[500px]">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <Building2 size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-600">{t('no_active_proposal') || "No Active Proposal"}</h3>
              <p className="text-sm mt-2">{t('fill_application_form') || "Fill the application form to generate a KCC proposal."}</p>
            </div>
          )}

          {analyzing && (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 min-h-[500px] shadow-sm">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu size={24} className="text-blue-600" />
                </div>
              </div>
              <p className="text-gray-900 font-bold mt-6 text-lg">{t('analyzing_creditworthiness') || "Analyzing Creditworthiness..."}</p>
              <div className="flex flex-col gap-2 mt-4 text-sm text-gray-500 text-center">
                  <span className="animate-pulse">{t('fetching_land_records') || "Fetching Land Records..."}</span>
                  <span className="animate-pulse delay-75">{t('checking_cibil_score') || "Checking CIBIL Score..."}</span>
                  <span className="animate-pulse delay-150">{t('calculating_scale_of_finance') || "Calculating Scale of Finance..."}</span>
              </div>
            </div>
          )}

          {proposal && !analyzing && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              
              {/* 1. Credit Score & Limit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Credit Score Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <TrendingUp size={100} />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{t('credit_score_analysis') || "Credit Score Analysis"}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">{proposal.score}</span>
                      <span className="text-green-600 font-bold text-lg">{t('excellent') || "Excellent"}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${(proposal.score / 900) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500" /> {t('eligible_lowest_rates') || "Eligible for lowest interest rates"}
                    </p>
                  </div>
                </div>

                {/* Loan Limit Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Landmark size={100} />
                  </div>
                  <div>
                    <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">{t('approved_kcc_limit') || "Approved KCC Limit"}</h3>
                    <span className="text-4xl font-bold">₹ {proposal.loanDetails.totalLimit.toLocaleString()}</span>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded font-bold border border-white/10">
                        {proposal.loanDetails.scheme}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-blue-100 font-medium">{t('effective_interest_rate') || "Effective Interest Rate"}</span>
                    <div className="text-right">
                        <span className="text-3xl font-bold">{proposal.loanDetails.effectiveRate}%</span>
                        <span className="text-xs text-blue-200 block opacity-80">{t('per_annum') || "p.a."}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Insurance Module */}
              {proposal.insurance.covered && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group hover:border-blue-300 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                        <Umbrella className="text-blue-600" size={24} /> {t('pmfby_coverage') || "PMFBY Coverage"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{t('pmfby_full_name') || "Pradhan Mantri Fasal Bima Yojana"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold">{t('sum_insured') || "Sum Insured"}</p>
                      <p className="text-2xl font-bold text-gray-900">₹ {proposal.insurance.sumInsured.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-6 bg-blue-50/50 p-4 rounded-xl flex justify-between items-center border border-blue-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-600 font-bold uppercase">{t('premium_amount') || "Premium Amount"}</span>
                        <span className="text-sm text-gray-600">{t('deducted_from_loan') || "Deducted from loan amount"}</span>
                    </div>
                    <span className="font-bold text-blue-700 text-xl">₹ {proposal.insurance.premium.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* 3. Incentives Breakdown */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={20} /> {t('applied_subsidies') || "Applied Subsidies & Benefits"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {proposal.incentives.map((incentive, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${incentive.active ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={16} className={incentive.active ? 'text-green-600' : 'text-gray-400'} />
                        <span className={`text-xs font-bold uppercase ${incentive.active ? 'text-green-800' : 'text-gray-500'}`}>{incentive.name}</span>
                      </div>
                      <p className={`font-bold ${incentive.active ? 'text-gray-900' : 'text-gray-500'}`}>{incentive.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button 
                    onClick={() => handleRedirect('https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card')}
                    className="flex-1 bg-blue-700 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {t('apply_via_sbi') || "Apply via SBI Portal"} <ExternalLink size={18} />
                </button>
                <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2">
                  <FileText size={18} /> {t('download_sanction_letter') || "Download Sanction Letter"}
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                {t('provisional_assessment_note') || "* This is a provisional assessment based on Agri-Stack data. Final approval is subject to bank verification."}
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditFacilitation;
