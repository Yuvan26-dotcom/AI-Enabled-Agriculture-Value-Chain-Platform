const soilDatabase = require('../data/soil_database');
const stateSoilDefaults = require('../data/state_soil_defaults');
const { getStateForDistrict } = require('../utils/locationHelper');

const normalizeStateData = (stateData) => {
  return {
    core: {
      type: stateData.physical?.texture || "Unknown",
      texture: stateData.physical?.texture || "Unknown",
      color: stateData.physical?.color || "Unknown",
      organic_matter: stateData.core?.oc ? `${stateData.core.oc}%` : "Unknown"
    },
    nutrients: {
      N: stateData.nutrients?.n || 0,
      P: stateData.nutrients?.p || 0,
      K: stateData.nutrients?.k || 0,
      S: stateData.nutrients?.s || 0,
      Zn: stateData.nutrients?.zn || 0,
      Fe: stateData.nutrients?.fe || 0,
      Cu: stateData.nutrients?.cu || 0,
      B: stateData.nutrients?.b || 0,
      Ca: 10, 
      Mg: 5, 
      Mn: stateData.nutrients?.mn || 0,
      pH: stateData.core?.ph || 7.0,
      salinity: "Normal"
    },
    electrical: {
      ec: stateData.core?.ec || 0,
      behavior: "Normal",
      resistivity: "Unknown",
      moisture_effect: "Unknown",
      temp_effect: "Unknown"
    },
    physical: {
      water_holding: stateData.physical?.water_holding ? `${stateData.physical.water_holding}%` : "Unknown",
      infiltration: stateData.physical?.infiltration ? `${stateData.physical.infiltration} mm/hr` : "Unknown",
      compaction: "Normal",
      cec: "Unknown",
      toc: stateData.core?.oc ? `${stateData.core.oc}%` : "Unknown",
      fertility: "Moderate"
    },
    crops: stateData.crops || { suitable: [], alternative: [], avoid: [] },
    suggestions: {
        fertilizer: stateData.suggestions?.[0] || "Generic fertilizer recommendation",
        improvement: stateData.suggestions?.[1] || "Generic improvement recommendation",
        irrigation: "Standard irrigation",
        mulching: "Recommended",
        organic: "Recommended"
    }
  };
};

exports.getSoilData = (req, res) => {
  try {
    const { district } = req.params;
    let { state } = req.query;

    // Normalize district name for display
    const formattedDistrict = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
    
    // 1. Try District Specific Data (High Precision)
    // We check case-insensitive match against keys in soilDatabase
    let data = null;
    const districtKey = Object.keys(soilDatabase).find(k => k.toLowerCase() === district.toLowerCase());
    if (districtKey) {
      data = soilDatabase[districtKey];
    }

    // 2. If no district data, try State Default (Medium Precision)
    if (!data) {
      // If state wasn't provided in query, try to find it from the district
      if (!state) {
        state = getStateForDistrict(district);
      }

      if (state) {
        // Check exact match for state name in defaults
        // The helper returns proper case "Madhya Pradesh", so direct lookup should work
        // But let's be safe with case-insensitive search
        const stateKey = Object.keys(stateSoilDefaults).find(k => k.toLowerCase() === state.toLowerCase());
        if (stateKey) {
          data = normalizeStateData(stateSoilDefaults[stateKey]);
        }
      }
    }

    // 3. Global Default (Fallback)
    if (!data) {
      data = soilDatabase["default"];
    }
    
    // Add metadata
    const responseData = {
      ...data,
      location: formattedDistrict,
      state: state || "Unknown",
      timestamp: new Date().toISOString(),
      source: "National Soil Survey & Land Use Planning (NBSS&LUP) / SLUSI"
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching soil data:", error);
    res.status(500).json({ message: "Server error fetching soil data" });
  }
};
