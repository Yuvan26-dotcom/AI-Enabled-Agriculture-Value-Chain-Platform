const soilDatabase = {
  "Indore": {
    core: {
      type: "Deep Black Soil (Vertisols)",
      texture: "Clayey (Fine)",
      color: "Dark Grey to Black",
      organic_matter: "0.65% (Medium)"
    },
    nutrients: {
      N: 240, // kg/ha (Low-Medium)
      P: 18,  // kg/ha (Medium)
      K: 380, // kg/ha (High)
      S: 12,  // ppm (Deficient)
      Zn: 0.58, // ppm (Deficient)
      Fe: 4.5, // ppm (Sufficient)
      Cu: 0.4, // ppm (Sufficient)
      B: 0.3,  // ppm (Marginal)
      Ca: 15,  // meq/100g
      Mg: 8,   // meq/100g
      Mn: 3,   // ppm
      pH: 7.8, // Moderately Alkaline
      salinity: "0.4 dS/m (Normal)"
    },
    electrical: {
      ec: 0.35, // dS/m
      behavior: "Semi-conductive",
      resistivity: "28.5 Ωm",
      moisture_effect: "High conductivity variation with moisture",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "High (60-70%)",
      infiltration: "Slow (0.2 cm/hr)",
      compaction: "High when wet",
      cec: "45 meq/100g",
      toc: "0.6%",
      fertility: "High potential"
    },
    crops: {
      suitable: ["Soybean (JS-9560)", "Soybean (JS-2034)", "Wheat", "Gram"],
      alternative: ["Mustard (Pusa Bold)", "Linseed", "Safflower"],
      avoid: ["Rice (Upland)", "Tea"],
      seasonal_note: "Critical drainage management required for Kharif."
    },
    suggestions: {
      fertilizer: "Apply N:P:K 80:40:20. Supplement ZnSO4 @ 25kg/ha.",
      improvement: "Broad Bed Furrow (BBF) system recommended.",
      irrigation: "Avoid flood irrigation; use sprinklers.",
      mulching: "Essential for moisture conservation in Rabi.",
      organic: "FYM @ 10t/ha every 3 years."
    }
  },
  "Latur": {
    core: {
      type: "Medium Black Soil (Inceptisols)",
      texture: "Clay Loam",
      color: "Dark Brown to Black",
      organic_matter: "0.55% (Low-Medium)"
    },
    nutrients: {
      N: 180, // kg/ha (Low)
      P: 12,  // kg/ha (Low)
      K: 420, // kg/ha (Very High)
      S: 8,   // ppm (Deficient)
      Zn: 0.45, // ppm (Deficient)
      Fe: 3.8, // ppm (Marginal)
      Cu: 0.5, // ppm
      B: 0.4,  // ppm
      Ca: 18,  // meq/100g
      Mg: 6,   // meq/100g
      Mn: 2.5, // ppm
      pH: 8.1, // Alkaline
      salinity: "0.5 dS/m"
    },
    electrical: {
      ec: 0.42,
      behavior: "Resistive when dry",
      resistivity: "32 Ωm",
      moisture_effect: "Moderate",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "Medium-High (55%)",
      infiltration: "Moderate (0.5 cm/hr)",
      compaction: "Medium",
      cec: "38 meq/100g",
      toc: "0.5%",
      fertility: "Medium"
    },
    crops: {
      suitable: ["Soybean (MAUS-71)", "Sunflower (LSHF-171)", "Pigeon Pea"],
      alternative: ["Safflower (Bhima)", "Niger", "Sesame"],
      avoid: ["Sugarcane (without drip)", "Banana"],
      seasonal_note: "Moisture stress common in late Kharif."
    },
    suggestions: {
      fertilizer: "Focus on P and S application. Use SSP instead of DAP.",
      improvement: "Compartmental bunding for water conservation.",
      irrigation: "Life-saving irrigation critical at pod filling.",
      mulching: "Dust mulching effective.",
      organic: "Green manuring with Sunhemp."
    }
  },
  "Vidisha": {
    core: {
      type: "Deep Black Soil (Vertisols)",
      texture: "Heavy Clay",
      color: "Black",
      organic_matter: "0.70% (Medium)"
    },
    nutrients: {
      N: 260, // kg/ha
      P: 22,  // kg/ha
      K: 350, // kg/ha
      S: 15,  // ppm
      Zn: 0.6, // ppm
      Fe: 5.0, // ppm
      Cu: 0.6, // ppm
      B: 0.5,  // ppm
      Ca: 20,  // meq/100g
      Mg: 9,   // meq/100g
      Mn: 4,   // ppm
      pH: 7.6, // Neutral to Alkaline
      salinity: "0.3 dS/m"
    },
    electrical: {
      ec: 0.30,
      behavior: "Conductive",
      resistivity: "25 Ωm",
      moisture_effect: "High",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "Very High (75%)",
      infiltration: "Very Slow (<0.1 cm/hr)",
      compaction: "Severe cracking when dry",
      cec: "50 meq/100g",
      toc: "0.65%",
      fertility: "High"
    },
    crops: {
      suitable: ["Wheat (Sharbati)", "Soybean", "Gram", "Lentil"],
      alternative: ["Teora", "Peas"],
      avoid: ["Maize (Waterlogging sensitive)"],
      seasonal_note: "Excellent for rainfed Rabi crops."
    },
    suggestions: {
      fertilizer: "Balanced NPK. Sulphur for oilseeds/pulses.",
      improvement: "Deep ploughing in summer to manage cracks.",
      irrigation: "Check basin method or sprinklers.",
      mulching: "Straw mulch.",
      organic: "Bio-fertilizers (Rhizobium/PSB) essential."
    }
  },
  "Rajkot": {
    core: {
      type: "Medium Black Calcareous Soil",
      texture: "Clay Loam to Loam",
      color: "Dark Brown",
      organic_matter: "0.45% (Low)"
    },
    nutrients: {
      N: 160, // kg/ha (Low)
      P: 25,  // kg/ha (Medium-High)
      K: 300, // kg/ha (High)
      S: 10,  // ppm
      Zn: 0.5, // ppm
      Fe: 3.5, // ppm (Deficient due to CaCO3)
      Cu: 0.3, // ppm
      B: 0.4,  // ppm
      Ca: 25,  // meq/100g (High)
      Mg: 5,   // meq/100g
      Mn: 2,   // ppm
      pH: 8.3, // Alkaline
      salinity: "0.8 dS/m (Slightly Saline)"
    },
    electrical: {
      ec: 0.6,
      behavior: "Conductive",
      resistivity: "20 Ωm",
      moisture_effect: "Medium",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "Medium (50%)",
      infiltration: "Moderate",
      compaction: "Crust formation possible",
      cec: "30 meq/100g",
      toc: "0.4%",
      fertility: "Medium"
    },
    crops: {
      suitable: ["Groundnut (GG-20)", "Groundnut (TG-37A)", "Castor (GCH-7)", "Sesame"],
      alternative: ["Sunflower", "Cotton"],
      avoid: ["Acid-loving crops"],
      seasonal_note: "Groundnut requires gypsum application."
    },
    suggestions: {
      fertilizer: "Ammonium Sulphate preferred over Urea. Apply Gypsum.",
      improvement: "Sulphur oxidation is slow; use elemental sulphur early.",
      irrigation: "Drip irrigation highly recommended.",
      mulching: "Plastic mulch for groundnut.",
      organic: "Castor cake application."
    }
  },
  "Amravati": {
    core: {
      type: "Deep Black Soil (Vertisols)",
      texture: "Clay",
      color: "Black",
      organic_matter: "0.60% (Medium)"
    },
    nutrients: {
      N: 220, // kg/ha
      P: 15,  // kg/ha
      K: 400, // kg/ha
      S: 9,   // ppm
      Zn: 0.6, // ppm
      Fe: 4.2, // ppm
      Cu: 0.5, // ppm
      B: 0.3,  // ppm
      Ca: 16,  // meq/100g
      Mg: 7,   // meq/100g
      Mn: 3.5, // ppm
      pH: 7.9, // Alkaline
      salinity: "0.35 dS/m"
    },
    electrical: {
      ec: 0.32,
      behavior: "Semi-conductive",
      resistivity: "29 Ωm",
      moisture_effect: "High",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "High",
      infiltration: "Slow",
      compaction: "High",
      cec: "42 meq/100g",
      toc: "0.55%",
      fertility: "High"
    },
    crops: {
      suitable: ["Cotton", "Soybean", "Pigeon Pea", "Orange"],
      alternative: ["Green Gram", "Black Gram"],
      avoid: ["Waterlogging sensitive crops in lowlands"],
      seasonal_note: "Cotton-Soybean rotation common."
    },
    suggestions: {
      fertilizer: "Split application of N. Foliar spray of MgSO4 for cotton.",
      improvement: "Ridge and Furrow method.",
      irrigation: "Drip for orchards.",
      mulching: "In-situ mulching.",
      organic: "Nadep compost."
    }
  },
  "Junagadh": {
    core: {
      type: "Medium Black Calcareous",
      texture: "Loamy",
      color: "Brown to Dark Brown",
      organic_matter: "0.50% (Low-Medium)"
    },
    nutrients: {
      N: 190, // kg/ha
      P: 28,  // kg/ha
      K: 280, // kg/ha
      S: 14,  // ppm
      Zn: 0.7, // ppm
      Fe: 4.0, // ppm
      Cu: 0.4, // ppm
      B: 0.5,  // ppm
      Ca: 22,  // meq/100g
      Mg: 6,   // meq/100g
      Mn: 2.8, // ppm
      pH: 8.0, // Alkaline
      salinity: "0.6 dS/m"
    },
    electrical: {
      ec: 0.5,
      behavior: "Conductive",
      resistivity: "22 Ωm",
      moisture_effect: "Medium",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "Medium",
      infiltration: "Good",
      compaction: "Low",
      cec: "28 meq/100g",
      toc: "0.45%",
      fertility: "Medium-High"
    },
    crops: {
      suitable: ["Groundnut (GG-20)", "Mango (Kesar)", "Wheat", "Coriander"],
      alternative: ["Onion", "Garlic"],
      avoid: ["Salinity sensitive crops near coast"],
      seasonal_note: "Groundnut bowl of India."
    },
    suggestions: {
      fertilizer: "Use SSP for Groundnut. Micronutrient mix spray.",
      improvement: "Gypsum application for pod filling.",
      irrigation: "Critical at pegging stage.",
      mulching: "Shell mulch.",
      organic: "Groundnut shell compost."
    }
  },
  "Bhopal": {
    core: {
      type: "Deep Black Soil (Vertisols)",
      texture: "Clayey",
      color: "Dark Grey to Black",
      organic_matter: "0.60% (Medium)"
    },
    nutrients: {
      N: 230,
      P: 16,
      K: 360,
      S: 10,
      Zn: 0.55,
      Fe: 4.2,
      Cu: 0.38,
      B: 0.28,
      Ca: 16,
      Mg: 7.5,
      Mn: 2.8,
      pH: 7.6,
      salinity: "0.35 dS/m (Normal)"
    },
    electrical: {
      ec: 0.32,
      behavior: "Semi-conductive",
      resistivity: "26 Ωm",
      moisture_effect: "High variation",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "High (65%)",
      infiltration: "Slow",
      compaction: "High when wet",
      cec: "42 meq/100g",
      toc: "0.55%",
      fertility: "High"
    },
    crops: {
      suitable: ["Soybean", "Wheat", "Chickpea", "Lentil"],
      alternative: ["Maize", "Peas"],
      avoid: ["Groundnut (in heavy clay)", "Potatoes (if waterlogged)"],
      seasonal_note: "Drainage is crucial during monsoon."
    },
    suggestions: {
      fertilizer: "N:P:K 20:60:20 for legumes. Add Sulphur.",
      improvement: "Deep ploughing in summer.",
      irrigation: "Sprinkler irrigation recommended.",
      mulching: "Beneficial for Rabi crops.",
      organic: "Vermicompost @ 2t/ha."
    }
  },
  "Jaipur": {
    core: {
      type: "Desert Soil (Aridisols)",
      texture: "Sandy Loam",
      color: "Brown to Yellowish",
      organic_matter: "0.25% (Low)"
    },
    nutrients: {
      N: 180,
      P: 22,
      K: 280,
      S: 15,
      Zn: 0.45,
      Fe: 3.5,
      Cu: 0.3,
      B: 0.4,
      Ca: 10,
      Mg: 4,
      Mn: 2.0,
      pH: 8.2,
      salinity: "1.2 dS/m (Slightly Saline)"
    },
    electrical: {
      ec: 0.8,
      behavior: "Resistive",
      resistivity: "150 Ωm",
      moisture_effect: "Low retention, high resistivity",
      temp_effect: "High fluctuation"
    },
    physical: {
      water_holding: "Low (20-30%)",
      infiltration: "Rapid",
      compaction: "Low",
      cec: "10 meq/100g",
      toc: "0.2%",
      fertility: "Low-Medium"
    },
    crops: {
      suitable: ["Mustard (Giriraj)", "Mustard (RGN-73)", "Taramira", "Groundnut"],
      alternative: ["Barley", "Wheat (with irrigation)"],
      avoid: ["Rice", "Sugarcane"],
      seasonal_note: "Highly dependent on monsoon or irrigation."
    },
    suggestions: {
      fertilizer: "High Nitrogen requirement. Use Gypsum for pH.",
      improvement: "Add clay or tank silt to improve texture.",
      irrigation: "Drip irrigation is essential.",
      mulching: "Critical to prevent evaporation.",
      organic: "Apply bulky organic manure frequently."
    }
  },
  "Nagpur": {
    core: {
      type: "Black Cotton Soil (Regur)",
      texture: "Clayey",
      color: "Black",
      organic_matter: "0.7% (Medium-High)"
    },
    nutrients: {
      N: 250,
      P: 15,
      K: 400,
      S: 11,
      Zn: 0.6,
      Fe: 4.8,
      Cu: 0.5,
      B: 0.35,
      Ca: 18,
      Mg: 9,
      Mn: 3.2,
      pH: 7.9,
      salinity: "0.4 dS/m (Normal)"
    },
    electrical: {
      ec: 0.4,
      behavior: "Conductive",
      resistivity: "22 Ωm",
      moisture_effect: "Swelling affects conductivity",
      temp_effect: "Moderate"
    },
    physical: {
      water_holding: "Very High",
      infiltration: "Very Slow",
      compaction: "High",
      cec: "50 meq/100g",
      toc: "0.65%",
      fertility: "High"
    },
    crops: {
      suitable: ["Cotton", "Orange", "Soybean", "Tur"],
      alternative: ["Sorghum", "Wheat"],
      avoid: ["Root vegetables (in heavy clay)"],
      seasonal_note: "Prone to waterlogging."
    },
    suggestions: {
      fertilizer: "Balanced NPK. Micronutrients for citrus.",
      improvement: "Install drainage systems.",
      irrigation: "Drip for orchards.",
      mulching: "Organic mulch for orchards.",
      organic: "Green manuring with Dhaincha."
    }
  },
  "Dharwad": {
    core: {
      type: "Medium Black / Red Soil Mix",
      texture: "Clay Loam",
      color: "Dark Brown to Red",
      organic_matter: "0.55% (Medium)"
    },
    nutrients: {
      N: 220,
      P: 20,
      K: 300,
      S: 14,
      Zn: 0.5,
      Fe: 5.0,
      Cu: 0.45,
      B: 0.3,
      Ca: 12,
      Mg: 6,
      Mn: 3.5,
      pH: 7.2,
      salinity: "0.3 dS/m (Normal)"
    },
    electrical: {
      ec: 0.3,
      behavior: "Moderate",
      resistivity: "40 Ωm",
      moisture_effect: "Balanced",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "Medium-High",
      infiltration: "Moderate",
      compaction: "Medium",
      cec: "30 meq/100g",
      toc: "0.5%",
      fertility: "Medium-High"
    },
    crops: {
      suitable: ["Cotton", "Maize", "Sorghum", "Groundnut"],
      alternative: ["Chilli", "Soybean"],
      avoid: ["Water intensive crops without irrigation"],
      seasonal_note: "Good for both Kharif and Rabi."
    },
    suggestions: {
      fertilizer: "Apply P and Zn based on soil test.",
      improvement: "Contour bunding for erosion control.",
      irrigation: "Sprinkler/Drip.",
      mulching: "Crop residue retention.",
      organic: "Compost application."
    }
  },
  "Anantapur": {
    core: {
      type: "Red Soil (Alfisol)",
      texture: "Sandy Loam",
      color: "Red",
      organic_matter: "0.3% (Low)"
    },
    nutrients: {
      N: 160,
      P: 18,
      K: 240,
      S: 8,
      Zn: 0.4,
      Fe: 3.0,
      Cu: 0.25,
      B: 0.2,
      Ca: 8,
      Mg: 3,
      Mn: 1.8,
      pH: 6.8,
      salinity: "0.2 dS/m (Normal)"
    },
    electrical: {
      ec: 0.2,
      behavior: "Resistive",
      resistivity: "100 Ωm",
      moisture_effect: "Dries quickly",
      temp_effect: "High surface heat"
    },
    physical: {
      water_holding: "Low",
      infiltration: "High",
      compaction: "Surface crusting possible",
      cec: "12 meq/100g",
      toc: "0.25%",
      fertility: "Low"
    },
    crops: {
      suitable: ["Groundnut", "Pigeon pea", "Sunflower", "Millets"],
      alternative: ["Castor", "Mango (with irrigation)"],
      avoid: ["Rice", "Sugarcane"],
      seasonal_note: "Drought prone area."
    },
    suggestions: {
      fertilizer: "Split application of N. Add Gypsum for Ca/S.",
      improvement: "Tank silt application.",
      irrigation: "Protective irrigation/Drip.",
      mulching: "Dust mulching/Straw mulching essential.",
      organic: "Sheep penning/FYM."
    }
  },
  "Warangal": {
    core: {
      type: "Red Sandy Loam / Black Patches",
      texture: "Loam",
      color: "Red to Dark Brown",
      organic_matter: "0.5% (Medium)"
    },
    nutrients: {
      N: 210,
      P: 25,
      K: 290,
      S: 12,
      Zn: 0.65,
      Fe: 5.5,
      Cu: 0.5,
      B: 0.3,
      Ca: 11,
      Mg: 5,
      Mn: 3.0,
      pH: 7.0,
      salinity: "0.3 dS/m (Normal)"
    },
    electrical: {
      ec: 0.3,
      behavior: "Moderate",
      resistivity: "50 Ωm",
      moisture_effect: "Moderate",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "Medium",
      infiltration: "Moderate",
      compaction: "Medium",
      cec: "25 meq/100g",
      toc: "0.45%",
      fertility: "Medium"
    },
    crops: {
      suitable: ["Rice", "Cotton", "Chilli", "Maize"],
      alternative: ["Turmeric", "Groundnut"],
      avoid: ["Highly saline sensitive crops"],
      seasonal_note: "Check for pest outbreaks in cotton/chilli."
    },
    suggestions: {
      fertilizer: "Integrated Nutrient Management.",
      improvement: "Green leaf manuring.",
      irrigation: "Canal/Borewell management.",
      mulching: "Polythene mulch for Chilli.",
      organic: "Neem cake application."
    }
  },
  "Vellore": {
    core: {
      type: "Red Loam / Sandy Loam",
      texture: "Sandy Clay Loam",
      color: "Reddish Brown",
      organic_matter: "0.4% (Low-Medium)"
    },
    nutrients: {
      N: 190,
      P: 20,
      K: 260,
      S: 10,
      Zn: 0.5,
      Fe: 4.0,
      Cu: 0.35,
      B: 0.25,
      Ca: 9,
      Mg: 4,
      Mn: 2.5,
      pH: 7.4,
      salinity: "0.5 dS/m (Slightly Saline in pockets)"
    },
    electrical: {
      ec: 0.5,
      behavior: "Moderate",
      resistivity: "60 Ωm",
      moisture_effect: "Variable",
      temp_effect: "High"
    },
    physical: {
      water_holding: "Low-Medium",
      infiltration: "Moderate-Rapid",
      compaction: "Hard setting when dry",
      cec: "18 meq/100g",
      toc: "0.35%",
      fertility: "Medium"
    },
    crops: {
      suitable: ["Groundnut", "Sorghum", "Coconut", "Pulses"],
      alternative: ["Banana", "Sugarcane (with water)"],
      avoid: ["Waterlogging sensitive crops"],
      seasonal_note: "Rainfall is erratic."
    },
    suggestions: {
      fertilizer: "Correct Iron chlorosis if seen.",
      improvement: "Coir pith compost application.",
      irrigation: "Drip irrigation for coconut.",
      mulching: "Live mulching in orchards.",
      organic: "Bio-fertilizers (Rhizobium)."
    }
  },
  "Agra": {
    core: {
      type: "Alluvial Soil (Inceptisols)",
      texture: "Sandy Loam",
      color: "Light Grey to Yellowish",
      organic_matter: "0.45% (Low-Medium)"
    },
    nutrients: {
      N: 200,
      P: 22,
      K: 320,
      S: 13,
      Zn: 0.55,
      Fe: 4.5,
      Cu: 0.4,
      B: 0.3,
      Ca: 14,
      Mg: 6,
      Mn: 2.8,
      pH: 8.0,
      salinity: "0.8 dS/m (Risk of salinity)"
    },
    electrical: {
      ec: 0.6,
      behavior: "Conductive",
      resistivity: "35 Ωm",
      moisture_effect: "Good retention",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "Medium",
      infiltration: "Moderate",
      compaction: "Medium",
      cec: "20 meq/100g",
      toc: "0.4%",
      fertility: "High"
    },
    crops: {
      suitable: ["Wheat", "Mustard", "Potato", "Bajra"],
      alternative: ["Barley", "Vegetables"],
      avoid: ["Acid-loving crops"],
      seasonal_note: "Frost risk in winter for potato/mustard."
    },
    suggestions: {
      fertilizer: "Use Acidic fertilizers (Urea/Ammonium Sulfate).",
      improvement: "Leaching of salts if required.",
      irrigation: "Tubewell irrigation common.",
      mulching: "Straw mulch for potato.",
      organic: "FYM to buffer pH."
    }
  },
  "Hisar": {
    core: {
      type: "Sandy Loam / Alluvial",
      texture: "Loamy Sand",
      color: "Light Brown",
      organic_matter: "0.35% (Low)"
    },
    nutrients: {
      N: 185,
      P: 18,
      K: 350,
      S: 15,
      Zn: 0.5,
      Fe: 3.8,
      Cu: 0.3,
      B: 0.4,
      Ca: 12,
      Mg: 5,
      Mn: 2.2,
      pH: 8.3,
      salinity: "1.0 dS/m (Saline patches)"
    },
    electrical: {
      ec: 0.9,
      behavior: "Variable",
      resistivity: "45 Ωm",
      moisture_effect: "Dries fast",
      temp_effect: "Extreme"
    },
    physical: {
      water_holding: "Low-Medium",
      infiltration: "Rapid",
      compaction: "Low",
      cec: "15 meq/100g",
      toc: "0.3%",
      fertility: "Medium"
    },
    crops: {
      suitable: ["Wheat", "Cotton", "Mustard", "Guar"],
      alternative: ["Barley", "Gram"],
      avoid: ["Rice (unless reclaimed soil)"],
      seasonal_note: "Heat stress in summer."
    },
    suggestions: {
      fertilizer: "Zinc application is often needed.",
      improvement: "Gypsum for sodic patches.",
      irrigation: "Canal/Sprinkler.",
      mulching: "Essential for moisture.",
      organic: "Green manuring."
    }
  },
  "Bathinda": {
    core: {
      type: "Alluvial / Sandy Loam",
      texture: "Sandy Loam",
      color: "Pale Brown",
      organic_matter: "0.4% (Low-Medium)"
    },
    nutrients: {
      N: 210,
      P: 24,
      K: 330,
      S: 14,
      Zn: 0.6,
      Fe: 4.2,
      Cu: 0.4,
      B: 0.35,
      Ca: 13,
      Mg: 6,
      Mn: 2.6,
      pH: 8.1,
      salinity: "0.6 dS/m (Rising)"
    },
    electrical: {
      ec: 0.5,
      behavior: "Moderate",
      resistivity: "40 Ωm",
      moisture_effect: "Moderate",
      temp_effect: "High"
    },
    physical: {
      water_holding: "Medium",
      infiltration: "Moderate",
      compaction: "Medium",
      cec: "18 meq/100g",
      toc: "0.38%",
      fertility: "High (with inputs)"
    },
    crops: {
      suitable: ["Wheat", "Cotton", "Rice", "Kinnow"],
      alternative: ["Mustard", "Barley"],
      avoid: ["Waterlogging sensitive crops in low areas"],
      seasonal_note: "Cotton leaf curl virus risk."
    },
    suggestions: {
      fertilizer: "Balanced NPK + Zn.",
      improvement: "Laser land leveling.",
      irrigation: "Canal water preferred over groundwater.",
      mulching: "Residue management (Happy Seeder).",
      organic: "Pressmud application."
    }
  },
  "Nadia": {
    core: {
      type: "New Alluvial (Entisols)",
      texture: "Silt Loam",
      color: "Greyish",
      organic_matter: "0.55% (Medium)"
    },
    nutrients: {
      N: 220,
      P: 28,
      K: 250,
      S: 11,
      Zn: 0.7,
      Fe: 6.0,
      Cu: 0.6,
      B: 0.4,
      Ca: 10,
      Mg: 5,
      Mn: 4.0,
      pH: 6.5,
      salinity: "0.2 dS/m (Low)"
    },
    electrical: {
      ec: 0.25,
      behavior: "Conductive",
      resistivity: "30 Ωm",
      moisture_effect: "High retention",
      temp_effect: "Moderate"
    },
    physical: {
      water_holding: "High",
      infiltration: "Moderate",
      compaction: "Medium",
      cec: "22 meq/100g",
      toc: "0.5%",
      fertility: "Very High"
    },
    crops: {
      suitable: ["Rice", "Jute", "Vegetables", "Mustard"],
      alternative: ["Banana", "Flowers"],
      avoid: ["Crops requiring dry root zone"],
      seasonal_note: "Arsenic contamination in groundwater checks needed."
    },
    suggestions: {
      fertilizer: "N & K split application.",
      improvement: "Drainage in monsoon.",
      irrigation: "Shallow tubewells.",
      mulching: "Plastic mulch for vegetables.",
      organic: "Mustard cake/Compost."
    }
  },
  "State_Rajasthan": {
    core: { type: "Desert Soil (Aridisols)", texture: "Sandy", color: "Brown", organic_matter: "0.2% (Low)" },
    nutrients: { N: 150, P: 20, K: 300, S: 10, Zn: 0.4, Fe: 3.0, Cu: 0.2, B: 0.3, Ca: 12, Mg: 5, Mn: 2, pH: 8.2, salinity: "High" },
    electrical: { ec: 0.8, behavior: "Resistive", resistivity: "100 Ωm", moisture_effect: "Low", temp_effect: "High" },
    physical: { water_holding: "Low", infiltration: "High", compaction: "Low", cec: "10 meq/100g", toc: "0.2%", fertility: "Low" },
    crops: { suitable: ["Bajra", "Guar", "Mustard"], alternative: ["Moong"], avoid: ["Rice"], seasonal_note: "Drought tolerant crops only." },
    suggestions: { fertilizer: "High N", improvement: "Add clay", irrigation: "Drip", mulching: "Essential", organic: "Manure" }
  },
  "State_Maharashtra": {
    core: { type: "Black Cotton Soil (Regur)", texture: "Clayey", color: "Black", organic_matter: "0.6% (Medium)" },
    nutrients: { N: 200, P: 15, K: 350, S: 12, Zn: 0.5, Fe: 4.5, Cu: 0.4, B: 0.3, Ca: 18, Mg: 8, Mn: 3, pH: 7.8, salinity: "Normal" },
    electrical: { ec: 0.4, behavior: "Conductive", resistivity: "25 Ωm", moisture_effect: "High", temp_effect: "Standard" },
    physical: { water_holding: "High", infiltration: "Low", compaction: "High", cec: "45 meq/100g", toc: "0.6%", fertility: "High" },
    crops: { suitable: ["Cotton", "Soybean", "Sorghum"], alternative: ["Pigeon Pea"], avoid: ["Root crops"], seasonal_note: "Drainage needed." },
    suggestions: { fertilizer: "Balanced NPK", improvement: "Drainage", irrigation: "Drip", mulching: "Organic", organic: "Compost" }
  },
  "State_Karnataka": {
    core: { type: "Red Soil (Alfisol)", texture: "Sandy Loam", color: "Red", organic_matter: "0.4% (Low)" },
    nutrients: { N: 180, P: 18, K: 250, S: 10, Zn: 0.5, Fe: 4.0, Cu: 0.3, B: 0.2, Ca: 10, Mg: 4, Mn: 2.5, pH: 6.8, salinity: "Normal" },
    electrical: { ec: 0.3, behavior: "Resistive", resistivity: "60 Ωm", moisture_effect: "Moderate", temp_effect: "Standard" },
    physical: { water_holding: "Low-Medium", infiltration: "High", compaction: "Medium", cec: "15 meq/100g", toc: "0.4%", fertility: "Medium" },
    crops: { suitable: ["Ragi", "Groundnut", "Maize"], alternative: ["Pulses"], avoid: ["Cotton"], seasonal_note: "Rainfed farming." },
    suggestions: { fertilizer: "NPK + Zn", improvement: "Tank silt", irrigation: "Sprinkler", mulching: "Live mulch", organic: "Biofertilizers" }
  },
  "State_Tamil Nadu": {
    core: { type: "Red Loam", texture: "Loam", color: "Red", organic_matter: "0.35% (Low)" },
    nutrients: { N: 170, P: 15, K: 280, S: 8, Zn: 0.4, Fe: 3.5, Cu: 0.3, B: 0.2, Ca: 9, Mg: 4, Mn: 2, pH: 7.2, salinity: "Normal" },
    electrical: { ec: 0.4, behavior: "Moderate", resistivity: "50 Ωm", moisture_effect: "Moderate", temp_effect: "High" },
    physical: { water_holding: "Medium", infiltration: "Moderate", compaction: "Hard setting", cec: "18 meq/100g", toc: "0.35%", fertility: "Medium" },
    crops: { suitable: ["Groundnut", "Sorghum", "Pulses"], alternative: ["Millets"], avoid: ["Water intensive"], seasonal_note: "NE Monsoon dependent." },
    suggestions: { fertilizer: "Split N", improvement: "Coir pith", irrigation: "Drip", mulching: " essential", organic: "Green manure" }
  },
  "State_Kerala": {
    core: { type: "Laterite Soil", texture: "Porous Clay", color: "Reddish", organic_matter: "0.8% (High)" },
    nutrients: { N: 200, P: 10, K: 150, S: 8, Zn: 0.6, Fe: 10.0, Cu: 0.5, B: 0.2, Ca: 5, Mg: 2, Mn: 5, pH: 5.5, salinity: "Low" },
    electrical: { ec: 0.1, behavior: "Resistive", resistivity: "200 Ωm", moisture_effect: "Low", temp_effect: "Standard" },
    physical: { water_holding: "Low", infiltration: "Very High", compaction: "Low", cec: "8 meq/100g", toc: "0.8%", fertility: "Low (Acidic)" },
    crops: { suitable: ["Rubber", "Coconut", "Tea", "Spices"], alternative: ["Tapioca"], avoid: ["Alkaline loving"], seasonal_note: "High rainfall." },
    suggestions: { fertilizer: "Liming essential", improvement: "Terracing", irrigation: "Rainfed", mulching: "Cover crops", organic: "Bone meal" }
  },
  "State_West Bengal": {
    core: { type: "Alluvial Soil", texture: "Silt Loam", color: "Grey", organic_matter: "0.5% (Medium)" },
    nutrients: { N: 210, P: 25, K: 240, S: 12, Zn: 0.6, Fe: 5.0, Cu: 0.4, B: 0.3, Ca: 12, Mg: 5, Mn: 3, pH: 6.5, salinity: "Low" },
    electrical: { ec: 0.2, behavior: "Conductive", resistivity: "30 Ωm", moisture_effect: "High", temp_effect: "Standard" },
    physical: { water_holding: "High", infiltration: "Moderate", compaction: "Medium", cec: "20 meq/100g", toc: "0.5%", fertility: "High" },
    crops: { suitable: ["Rice", "Jute", "Potato"], alternative: ["Mustard"], avoid: ["Dry crops"], seasonal_note: "Flood prone." },
    suggestions: { fertilizer: "Balanced", improvement: "Drainage", irrigation: "Tube well", mulching: "Straw", organic: "Mustard cake" }
  },
  "State_Punjab": {
    core: { type: "Alluvial Soil", texture: "Sandy Loam", color: "Pale Brown", organic_matter: "0.4% (Low)" },
    nutrients: { N: 220, P: 22, K: 300, S: 14, Zn: 0.5, Fe: 4.0, Cu: 0.3, B: 0.3, Ca: 14, Mg: 6, Mn: 2.5, pH: 8.0, salinity: "Rising" },
    electrical: { ec: 0.5, behavior: "Moderate", resistivity: "40 Ωm", moisture_effect: "Moderate", temp_effect: "High" },
    physical: { water_holding: "Medium", infiltration: "Moderate", compaction: "Medium", cec: "18 meq/100g", toc: "0.4%", fertility: "High" },
    crops: { suitable: ["Wheat", "Rice", "Cotton"], alternative: ["Maize"], avoid: ["Pulses (in saline)"], seasonal_note: "Intensive cropping." },
    suggestions: { fertilizer: "Zinc needed", improvement: "Laser leveling", irrigation: "Canal", mulching: "Residue", organic: "Pressmud" }
  },
  "State_Uttar Pradesh": {
    core: { type: "Alluvial Soil", texture: "Loam", color: "Yellowish Grey", organic_matter: "0.45% (Medium)" },
    nutrients: { N: 200, P: 20, K: 280, S: 12, Zn: 0.5, Fe: 4.2, Cu: 0.3, B: 0.3, Ca: 13, Mg: 6, Mn: 2.8, pH: 7.8, salinity: "Normal" },
    electrical: { ec: 0.4, behavior: "Conductive", resistivity: "35 Ωm", moisture_effect: "Good", temp_effect: "Standard" },
    physical: { water_holding: "Medium", infiltration: "Moderate", compaction: "Medium", cec: "20 meq/100g", toc: "0.45%", fertility: "High" },
    crops: { suitable: ["Wheat", "Sugarcane", "Rice"], alternative: ["Potato"], avoid: ["-"], seasonal_note: "Gangetic plains." },
    suggestions: { fertilizer: "Urea/DAP", improvement: "Green manure", irrigation: "Tube well", mulching: "Straw", organic: "FYM" }
  },
  "State_Gujarat": {
    core: { type: "Medium Black / Sandy", texture: "Sandy Clay", color: "Grey/Black", organic_matter: "0.35% (Low)" },
    nutrients: { N: 180, P: 25, K: 300, S: 15, Zn: 0.4, Fe: 3.5, Cu: 0.3, B: 0.4, Ca: 20, Mg: 8, Mn: 2, pH: 8.2, salinity: "High" },
    electrical: { ec: 0.7, behavior: "Conductive", resistivity: "20 Ωm", moisture_effect: "Medium", temp_effect: "High" },
    physical: { water_holding: "Medium", infiltration: "Moderate", compaction: "Crusting", cec: "30 meq/100g", toc: "0.35%", fertility: "Medium" },
    crops: { suitable: ["Groundnut", "Cotton", "Castor"], alternative: ["Cumin"], avoid: ["Acid loving"], seasonal_note: "Salinity management." },
    suggestions: { fertilizer: "Sulphur", improvement: "Gypsum", irrigation: "Drip", mulching: "Plastic", organic: "Castor cake" }
  },
  "State_Andhra Pradesh": {
    core: { type: "Red Soil", texture: "Sandy Loam", color: "Red", organic_matter: "0.3% (Low)" },
    nutrients: { N: 160, P: 18, K: 220, S: 8, Zn: 0.4, Fe: 3.0, Cu: 0.2, B: 0.2, Ca: 8, Mg: 3, Mn: 2, pH: 7.0, salinity: "Normal" },
    electrical: { ec: 0.3, behavior: "Resistive", resistivity: "80 Ωm", moisture_effect: "Low", temp_effect: "High" },
    physical: { water_holding: "Low", infiltration: "High", compaction: "Surface crust", cec: "12 meq/100g", toc: "0.3%", fertility: "Low-Medium" },
    crops: { suitable: ["Chilli", "Tobacco", "Groundnut"], alternative: ["Sunflower"], avoid: ["Rice (if water scarce)"], seasonal_note: "Cyclone prone." },
    suggestions: { fertilizer: "Complex", improvement: "Tank silt", irrigation: "Drip", mulching: "Essential", organic: "Sheep manure" }
  },
  "State_Madhya Pradesh": {
    core: { type: "Deep Black Soil", texture: "Clayey", color: "Black", organic_matter: "0.6% (Medium)" },
    nutrients: { N: 230, P: 20, K: 360, S: 12, Zn: 0.5, Fe: 4.5, Cu: 0.4, B: 0.3, Ca: 16, Mg: 7, Mn: 3, pH: 7.6, salinity: "Normal" },
    electrical: { ec: 0.3, behavior: "Semi-conductive", resistivity: "30 Ωm", moisture_effect: "High", temp_effect: "Standard" },
    physical: { water_holding: "High", infiltration: "Slow", compaction: "High", cec: "40 meq/100g", toc: "0.6%", fertility: "High" },
    crops: { suitable: ["Soybean", "Wheat", "Gram"], alternative: ["Mustard"], avoid: ["-"], seasonal_note: "Central India." },
    suggestions: { fertilizer: "Balanced", improvement: "Drainage", irrigation: "Sprinkler", mulching: "Yes", organic: "FYM" }
  },
  "State_Bihar": {
    core: { type: "Alluvial Soil", texture: "Silt Loam", color: "Greyish", organic_matter: "0.5% (Medium)" },
    nutrients: { N: 200, P: 22, K: 250, S: 10, Zn: 0.5, Fe: 4.0, Cu: 0.3, B: 0.2, Ca: 12, Mg: 5, Mn: 2, pH: 7.4, salinity: "Low" },
    electrical: { ec: 0.3, behavior: "Conductive", resistivity: "35 Ωm", moisture_effect: "High", temp_effect: "Standard" },
    physical: { water_holding: "High", infiltration: "Moderate", compaction: "Medium", cec: "18 meq/100g", toc: "0.5%", fertility: "High" },
    crops: { suitable: ["Rice", "Wheat", "Maize"], alternative: ["Pulses"], avoid: ["-"], seasonal_note: "Flood prone." },
    suggestions: { fertilizer: "Urea/DAP", improvement: "Drainage", irrigation: "Tube well", mulching: "Straw", organic: "Compost" }
  },
  "State_Jharkhand": {
    core: { type: "Red Soil", texture: "Sandy Loam", color: "Red", organic_matter: "0.35% (Low)" },
    nutrients: { N: 160, P: 15, K: 200, S: 8, Zn: 0.4, Fe: 5.0, Cu: 0.3, B: 0.2, Ca: 8, Mg: 3, Mn: 3, pH: 6.5, salinity: "Low" },
    electrical: { ec: 0.2, behavior: "Resistive", resistivity: "70 Ωm", moisture_effect: "Low", temp_effect: "Standard" },
    physical: { water_holding: "Low", infiltration: "High", compaction: "Low", cec: "12 meq/100g", toc: "0.35%", fertility: "Low-Medium" },
    crops: { suitable: ["Rice", "Pulses", "Millets"], alternative: ["Vegetables"], avoid: ["Water intensive"], seasonal_note: "Undulating terrain." },
    suggestions: { fertilizer: "Liming", improvement: "Bunds", irrigation: "Rainfed", mulching: "Essential", organic: "Green manure" }
  },
  "State_Odisha": {
    core: { type: "Red & Yellow Soil", texture: "Loam", color: "Red/Yellow", organic_matter: "0.4% (Low)" },
    nutrients: { N: 180, P: 18, K: 220, S: 10, Zn: 0.5, Fe: 4.5, Cu: 0.3, B: 0.2, Ca: 10, Mg: 4, Mn: 2.5, pH: 6.8, salinity: "Coastal Salinity" },
    electrical: { ec: 0.3, behavior: "Moderate", resistivity: "50 Ωm", moisture_effect: "Moderate", temp_effect: "Standard" },
    physical: { water_holding: "Medium", infiltration: "Moderate", compaction: "Medium", cec: "15 meq/100g", toc: "0.4%", fertility: "Medium" },
    crops: { suitable: ["Rice", "Pulses", "Oilseeds"], alternative: ["Jute"], avoid: ["-"], seasonal_note: "Cyclone prone." },
    suggestions: { fertilizer: "Balanced", improvement: "Drainage", irrigation: "Canal", mulching: "Straw", organic: "FYM" }
  },
  "State_Chhattisgarh": {
    core: { type: "Red & Yellow Soil", texture: "Sandy Loam", color: "Red/Yellow", organic_matter: "0.4% (Low)" },
    nutrients: { N: 170, P: 16, K: 210, S: 9, Zn: 0.4, Fe: 4.0, Cu: 0.3, B: 0.2, Ca: 9, Mg: 4, Mn: 2, pH: 6.6, salinity: "Low" },
    electrical: { ec: 0.2, behavior: "Resistive", resistivity: "60 Ωm", moisture_effect: "Low", temp_effect: "Standard" },
    physical: { water_holding: "Low-Medium", infiltration: "High", compaction: "Low", cec: "14 meq/100g", toc: "0.4%", fertility: "Medium" },
    crops: { suitable: ["Rice", "Soybean", "Pulses"], alternative: ["Maize"], avoid: ["-"], seasonal_note: "Rice bowl." },
    suggestions: { fertilizer: "NPK", improvement: "Bunds", irrigation: "Rainfed", mulching: "Yes", organic: "Compost" }
  },
  "State_Haryana": {
    core: { type: "Alluvial Soil", texture: "Sandy Loam", color: "Pale Brown", organic_matter: "0.35% (Low)" },
    nutrients: { N: 200, P: 20, K: 280, S: 12, Zn: 0.4, Fe: 3.5, Cu: 0.3, B: 0.3, Ca: 15, Mg: 6, Mn: 2, pH: 8.0, salinity: "Rising" },
    electrical: { ec: 0.6, behavior: "Conductive", resistivity: "30 Ωm", moisture_effect: "Moderate", temp_effect: "High" },
    physical: { water_holding: "Medium", infiltration: "Moderate", compaction: "Medium", cec: "18 meq/100g", toc: "0.35%", fertility: "High" },
    crops: { suitable: ["Wheat", "Rice", "Mustard"], alternative: ["Cotton"], avoid: ["-"], seasonal_note: "Intensive." },
    suggestions: { fertilizer: "Zinc", improvement: "Laser leveling", irrigation: "Canal", mulching: "Residue", organic: "FYM" }
  },
  "State_Assam": {
    core: { type: "Alluvial (Acidic)", texture: "Silt Loam", color: "Grey", organic_matter: "0.7% (High)" },
    nutrients: { N: 220, P: 15, K: 200, S: 10, Zn: 0.6, Fe: 6.0, Cu: 0.4, B: 0.2, Ca: 8, Mg: 3, Mn: 4, pH: 5.2, salinity: "Low" },
    electrical: { ec: 0.1, behavior: "Resistive", resistivity: "100 Ωm", moisture_effect: "High", temp_effect: "Standard" },
    physical: { water_holding: "High", infiltration: "Moderate", compaction: "Low", cec: "16 meq/100g", toc: "0.7%", fertility: "Medium" },
    crops: { suitable: ["Tea", "Rice", "Jute"], alternative: ["Vegetables"], avoid: ["Alkaline loving"], seasonal_note: "High rainfall." },
    suggestions: { fertilizer: "Liming", improvement: "Drainage", irrigation: "Rainfed", mulching: "Yes", organic: "Compost" }
  },
  "State_Telangana": {
    core: { type: "Red Soil", texture: "Sandy Loam", color: "Red", organic_matter: "0.3% (Low)" },
    nutrients: { N: 160, P: 18, K: 220, S: 8, Zn: 0.4, Fe: 3.0, Cu: 0.2, B: 0.2, Ca: 8, Mg: 3, Mn: 2, pH: 7.0, salinity: "Normal" },
    electrical: { ec: 0.3, behavior: "Resistive", resistivity: "80 Ωm", moisture_effect: "Low", temp_effect: "High" },
    physical: { water_holding: "Low", infiltration: "High", compaction: "Surface crust", cec: "12 meq/100g", toc: "0.3%", fertility: "Low-Medium" },
    crops: { suitable: ["Cotton", "Maize", "Soybean"], alternative: ["Turmeric"], avoid: ["-"], seasonal_note: "Semi-arid." },
    suggestions: { fertilizer: "Complex", improvement: "Tank silt", irrigation: "Drip", mulching: "Essential", organic: "Sheep manure" }
  },
  "State_Himachal Pradesh": {
    core: { type: "Mountain Soil", texture: "Loam to Clay Loam", color: "Brown", organic_matter: "0.9% (High)" },
    nutrients: { N: 250, P: 20, K: 280, S: 10, Zn: 0.5, Fe: 5.0, Cu: 0.4, B: 0.3, Ca: 10, Mg: 4, Mn: 3, pH: 6.0, salinity: "Low" },
    electrical: { ec: 0.1, behavior: "Resistive", resistivity: "150 Ωm", moisture_effect: "Variable", temp_effect: "Low" },
    physical: { water_holding: "Medium", infiltration: "High", compaction: "Low", cec: "20 meq/100g", toc: "0.9%", fertility: "Medium-High" },
    crops: { suitable: ["Apple", "Maize", "Potato"], alternative: ["Vegetables"], avoid: ["Tropical crops"], seasonal_note: "Cold winters." },
    suggestions: { fertilizer: "Balanced", improvement: "Terracing", irrigation: "Springs", mulching: "Pine needles", organic: "Compost" }
  },
  "State_Uttarakhand": {
    core: { type: "Mountain/Forest Soil", texture: "Loam", color: "Dark Brown", organic_matter: "1.0% (Very High)" },
    nutrients: { N: 260, P: 18, K: 260, S: 10, Zn: 0.5, Fe: 5.0, Cu: 0.4, B: 0.3, Ca: 12, Mg: 5, Mn: 3, pH: 6.2, salinity: "Low" },
    electrical: { ec: 0.1, behavior: "Resistive", resistivity: "140 Ωm", moisture_effect: "Variable", temp_effect: "Low" },
    physical: { water_holding: "High", infiltration: "High", compaction: "Low", cec: "25 meq/100g", toc: "1.0%", fertility: "High" },
    crops: { suitable: ["Rice", "Wheat", "Soybean"], alternative: ["Millets"], avoid: ["-"], seasonal_note: "Hilly terrain." },
    suggestions: { fertilizer: "Organic preferred", improvement: "Terracing", irrigation: "Rainfed", mulching: "Leaf litter", organic: "FYM" }
  },
  "State_Jammu & Kashmir": {
    core: { type: "Mountain/Alluvial", texture: "Silt Loam", color: "Brown", organic_matter: "0.8% (High)" },
    nutrients: { N: 240, P: 20, K: 300, S: 12, Zn: 0.5, Fe: 4.5, Cu: 0.4, B: 0.3, Ca: 15, Mg: 6, Mn: 2, pH: 7.0, salinity: "Low" },
    electrical: { ec: 0.2, behavior: "Moderate", resistivity: "60 Ωm", moisture_effect: "Moderate", temp_effect: "Low" },
    physical: { water_holding: "Medium", infiltration: "Moderate", compaction: "Medium", cec: "20 meq/100g", toc: "0.8%", fertility: "High" },
    crops: { suitable: ["Saffron", "Apple", "Rice"], alternative: ["Walnut"], avoid: ["Tropical"], seasonal_note: "Cold climate." },
    suggestions: { fertilizer: "Balanced", improvement: "Drainage", irrigation: "Canal", mulching: "Essential", organic: "Saffron corms" }
  },
  "State_Goa": {
    core: { type: "Laterite Soil", texture: "Sandy Loam", color: "Reddish", organic_matter: "0.6% (Medium)" },
    nutrients: { N: 180, P: 15, K: 200, S: 10, Zn: 0.5, Fe: 8.0, Cu: 0.4, B: 0.2, Ca: 6, Mg: 3, Mn: 4, pH: 5.8, salinity: "Coastal" },
    electrical: { ec: 0.2, behavior: "Resistive", resistivity: "120 Ωm", moisture_effect: "Low", temp_effect: "Standard" },
    physical: { water_holding: "Low", infiltration: "High", compaction: "Low", cec: "10 meq/100g", toc: "0.6%", fertility: "Low-Medium" },
    crops: { suitable: ["Cashew", "Coconut", "Rice"], alternative: ["Spices"], avoid: ["-"], seasonal_note: "High rainfall." },
    suggestions: { fertilizer: "Liming", improvement: "Bunds", irrigation: "Rainfed", mulching: "Yes", organic: "Fish meal" }
  },
  "default": {
    core: {
      type: "Alluvial Soil (Inceptisols)",
      texture: "Sandy Loam to Loam",
      color: "Light Grey to Ash",
      organic_matter: "0.40% (Low)"
    },
    nutrients: {
      N: 150, // kg/ha
      P: 15,  // kg/ha
      K: 200, // kg/ha
      S: 10,  // ppm
      Zn: 0.5, // ppm
      Fe: 4.0, // ppm
      Cu: 0.3, // ppm
      B: 0.2,  // ppm
      Ca: 10,  // meq/100g
      Mg: 4,   // meq/100g
      Mn: 2,   // ppm
      pH: 7.2, // Neutral
      salinity: "0.2 dS/m"
    },
    electrical: {
      ec: 0.2,
      behavior: "Resistive",
      resistivity: "40 Ωm",
      moisture_effect: "Low",
      temp_effect: "Standard"
    },
    physical: {
      water_holding: "Low-Medium",
      infiltration: "High",
      compaction: "Low",
      cec: "15 meq/100g",
      toc: "0.35%",
      fertility: "Medium"
    },
    crops: {
      suitable: ["Wheat", "Mustard", "Maize", "Pearl Millet"],
      alternative: ["Barley", "Pulses"],
      avoid: ["Water intensive crops without irrigation"],
      seasonal_note: "Suitable for wide range of crops with irrigation."
    },
    suggestions: {
      fertilizer: "Balanced NPK + Zn.",
      improvement: "Green manuring.",
      irrigation: "Frequent light irrigation.",
      mulching: "Straw mulch.",
      organic: "FYM incorporation."
    }
  }
};

module.exports = soilDatabase;
