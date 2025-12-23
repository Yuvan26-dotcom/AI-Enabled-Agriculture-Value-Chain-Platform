// Smart Market Data Generator
// Generates state-specific price data dynamically

const CROP_DEFAULTS = {
  "Soybean": { msp: 4600, basePrice: 4800, volatility: 0.02, trend: "bearish" },
  "Mustard": { msp: 5650, basePrice: 5650, volatility: 0.01, trend: "stable" },
  "Rapeseed & Mustard": { msp: 5650, basePrice: 5650, volatility: 0.01, trend: "stable" },
  "Groundnut": { msp: 6377, basePrice: 6300, volatility: 0.03, trend: "bullish" },
  "Sunflower": { msp: 6760, basePrice: 6500, volatility: 0.02, trend: "distress" },
  "Sesame": { msp: 8635, basePrice: 12000, volatility: 0.04, trend: "bullish" },
  "Castor": { msp: 5800, basePrice: 6000, volatility: 0.01, trend: "stable" },
  "Niger": { msp: 7734, basePrice: 7500, volatility: 0.02, trend: "bearish" },
  "Safflower": { msp: 5800, basePrice: 5500, volatility: 0.02, trend: "distress" },
  "Oil Palm": { msp: 12000, basePrice: 14000, volatility: 0.01, trend: "bullish" }, // Adjusted for Qtl
  "Cottonseed": { msp: 6620, basePrice: 3200, volatility: 0.02, trend: "stable" },
  "Linseed": { msp: 5400, basePrice: 5200, volatility: 0.02, trend: "bearish" },
  "Copra": { msp: 10860, basePrice: 11000, volatility: 0.01, trend: "bullish" }
};

// Deterministic hash to get a consistent multiplier for (State + Crop)
const getStateMultiplier = (state, crop) => {
  const str = state + crop;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Normalize to range 0.90 to 1.10 (±10% variance between states)
  const normalized = (Math.abs(hash) % 200) / 1000; // 0.000 to 0.199
  return 0.90 + normalized;
};

const generateHistory = (basePrice, trend) => {
  const history = [];
  let current = basePrice;
  
  // Generate past 15 days (Actual)
  for (let i = 15; i >= 0; i--) {
    const dayLabel = i === 0 ? 'Today' : `-${i}d`;
    // Add some random daily noise
    const noise = (Math.random() - 0.5) * (basePrice * 0.02); 
    
    // Apply trend bias
    if (trend === 'bullish') current += (basePrice * 0.005);
    if (trend === 'bearish') current -= (basePrice * 0.005);
    
    history.push({
      day: dayLabel,
      price: Math.round(current + noise),
      type: 'Actual'
    });
  }

  // Generate next 15 days (Forecast)
  // Reset current to last actual for continuity
  current = history[history.length - 1].price;
  
  for (let i = 1; i <= 15; i++) {
    const dayLabel = `+${i * 3}d`; // Every 3 days for forecast
    const noise = (Math.random() - 0.5) * (basePrice * 0.03); // More uncertainty
    
    if (trend === 'bullish') current += (basePrice * 0.005);
    if (trend === 'bearish') current -= (basePrice * 0.005);

    history.push({
      day: dayLabel,
      price: Math.round(current + noise),
      type: 'Forecast'
    });
  }
  
  return history;
};

// Helper to generate consistent random numbers from strings
const getHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export const getMarketData = (state, crop, district) => {
  const defaults = CROP_DEFAULTS[crop] || CROP_DEFAULTS["Soybean"];
  const multiplier = getStateMultiplier(state, crop);
  
  // Generate a seed based on location to vary prices slightly per district
  const seed = getHash(state + crop + (district || ''));
  const districtVariance = (seed % 50) / 1000; // 0-5% variance

  // Adjust base price for this state & district
  const localPrice = Math.round(defaults.basePrice * multiplier * (1 + districtVariance));
  
  // Generate history based on local price
  const history = generateHistory(localPrice, defaults.trend);
  
  // Get current price from "Today" entry
  const currentPrice = history.find(h => h.day === 'Today').price;

  // Generate Dynamic Buyers based on Location
  const buyers = [
    { 
      id: 1, 
      type: 'FPO', 
      name: district ? `${district} Farmers Producer Co.` : `${state} Farmers Collective`, 
      buyer_name: district ? `${district} FPO` : 'State Agro Fed', 
      location: district ? `${district} Mandi` : `Major Mandi, ${state}`, 
      qty_total: 1000 + (seed % 500), 
      qty_filled: (seed % 800), 
      price: Math.round(currentPrice * 1.02), // Slightly higher than market
      deadline: '2 Days Left' 
    },
    { 
      id: 2, 
      type: 'TRADER', 
      name: district ? `${district} Mandi Traders` : 'Local Mandi Agent', 
      buyer_name: district ? `${district} Agent` : 'Mandi Agent',
      location: district ? `${district} Mandi` : `District HQ, ${state}`, 
      qty_total: 50 + (seed % 20), 
      qty_filled: 0, 
      price: Math.round(currentPrice * 0.98), 
      deadline: 'Open' 
    },
    { 
      id: 3, 
      type: 'CORPORATE', 
      name: 'Global Oils Ltd.', 
      buyer_name: 'Global Oils Procurement', 
      location: 'Mumbai Port (Ex-Warehouse)', 
      qty_total: 5000, 
      qty_filled: Math.floor(Math.random() * 2000), 
      price: Math.round(currentPrice * 1.05), // Premium Price
      deadline: '5 Days Left' 
    },
    { 
      id: 4, 
      type: 'PROCESSOR', 
      name: district ? `${district} Oil Mills` : 'Patanjali Foods', 
      buyer_name: district ? `${district} Mills` : 'Patanjali Foods', 
      location: district ? `${district} Industrial Area` : `Industrial Area, ${state}`, 
      qty_total: 500 + (seed % 100), 
      qty_filled: Math.floor(Math.random() * 100), 
      price: Math.round(currentPrice * 1.01), 
      deadline: '1 Week Left' 
    },
    { 
      id: 5, 
      type: 'TRADER', 
      name: district ? `${district} Trading Co.` : 'Shyam Lal & Sons', 
      buyer_name: district ? `${district} Traders` : 'Shyam Lal Traders',
      location: district ? `${district} Market Yard` : `Local Market, ${state}`, 
      qty_total: 100 + (seed % 50), 
      qty_filled: 20, 
      price: Math.round(currentPrice * 0.99), 
      deadline: 'Today' 
    }
  ];

  return {
    msp: defaults.msp,
    currentPrice: currentPrice,
    trend: defaults.trend,
    source: `Agmarknet (${district || state} Mandi)`,
    history: history,
    buyers: buyers
  };
};

// Keep this for backward compatibility if needed, but getMarketData is preferred
export const oilseedMarketData = CROP_DEFAULTS;
