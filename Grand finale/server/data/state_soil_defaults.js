const stateSoilDefaults = {
  "Andhra Pradesh": {
    core: { ph: 7.2, ec: 0.4, oc: 0.6 },
    nutrients: { n: 180, p: 25, k: 280, s: 15, zn: 0.8, b: 0.6, fe: 5.5, mn: 4.2, cu: 0.9 },
    physical: { texture: "Red Loam", color: "Red", bulk_density: 1.4, porosity: 42, infiltration: 18, water_holding: 45 },
    suggestions: ["Apply Gypsum for pH correction", "Increase organic manure"],
    crops: {
      suitable: ["Rice", "Chilli", "Cotton", "Tobacco"],
      alternative: ["Maize", "Pulses"],
      avoid: ["Wheat"]
    }
  },
  "Telangana": {
    core: { ph: 7.0, ec: 0.3, oc: 0.5 },
    nutrients: { n: 170, p: 22, k: 260, s: 14, zn: 0.7, b: 0.5, fe: 5.2, mn: 4.0, cu: 0.8 },
    physical: { texture: "Red Sandy Loam", color: "Red", bulk_density: 1.45, porosity: 40, infiltration: 20, water_holding: 40 },
    suggestions: ["Use bio-fertilizers", "Adopt drip irrigation"],
    crops: {
      suitable: ["Cotton", "Maize", "Paddy", "Turmeric"],
      alternative: ["Soybean", "Groundnut"],
      avoid: ["Sugarcane"]
    }
  },
  "Karnataka": {
    core: { ph: 6.8, ec: 0.35, oc: 0.65 },
    nutrients: { n: 190, p: 28, k: 240, s: 16, zn: 0.9, b: 0.7, fe: 6.0, mn: 4.5, cu: 1.0 },
    physical: { texture: "Laterite", color: "Reddish Brown", bulk_density: 1.35, porosity: 45, infiltration: 22, water_holding: 50 },
    suggestions: ["Liming for acidic soils", "Mulching to conserve moisture"],
    crops: {
      suitable: ["Ragi", "Coffee", "Arecanut", "Sugarcane"],
      alternative: ["Pepper", "Cardamom"],
      avoid: ["Cotton"]
    }
  },
  "Tamil Nadu": {
    core: { ph: 7.4, ec: 0.5, oc: 0.55 },
    nutrients: { n: 160, p: 20, k: 300, s: 18, zn: 0.75, b: 0.55, fe: 5.0, mn: 3.8, cu: 0.85 },
    physical: { texture: "Clay Loam", color: "Black/Red", bulk_density: 1.5, porosity: 38, infiltration: 15, water_holding: 55 },
    suggestions: ["Green manuring", "Zinc sulphate application"],
    crops: {
      suitable: ["Rice", "Groundnut", "Sugarcane", "Banana"],
      alternative: ["Millets", "Pulses"],
      avoid: ["Apple"]
    }
  },
  "Maharashtra": {
    core: { ph: 7.6, ec: 0.45, oc: 0.6 },
    nutrients: { n: 175, p: 24, k: 320, s: 20, zn: 0.8, b: 0.6, fe: 5.8, mn: 4.1, cu: 0.9 },
    physical: { texture: "Black Cotton Soil", color: "Black", bulk_density: 1.55, porosity: 35, infiltration: 12, water_holding: 60 },
    suggestions: ["Deep ploughing", "Sulfur application for oilseeds"],
    crops: {
      suitable: ["Cotton", "Soybean", "Sugarcane", "Jowar"],
      alternative: ["Bajra", "Wheat"],
      avoid: ["Tea"]
    }
  },
  "Madhya Pradesh": {
    core: { ph: 7.3, ec: 0.4, oc: 0.58 },
    nutrients: { n: 165, p: 23, k: 290, s: 17, zn: 0.78, b: 0.58, fe: 5.5, mn: 4.0, cu: 0.88 },
    physical: { texture: "Medium Black", color: "Black/Grey", bulk_density: 1.5, porosity: 37, infiltration: 14, water_holding: 58 },
    suggestions: ["Balanced NPK use", "Vermicompost application"],
    crops: {
      suitable: ["Soybean", "Wheat", "Gram", "Mustard"],
      alternative: ["Maize", "Lentil"],
      avoid: ["Rubber"]
    }
  },
  "Uttar Pradesh": {
    core: { ph: 7.8, ec: 0.6, oc: 0.5 },
    nutrients: { n: 150, p: 18, k: 250, s: 15, zn: 0.6, b: 0.5, fe: 4.8, mn: 3.5, cu: 0.8 },
    physical: { texture: "Alluvial", color: "Light Grey", bulk_density: 1.4, porosity: 40, infiltration: 18, water_holding: 48 },
    suggestions: ["Reclamation of sodic soil", "Green manuring with Dhaincha"],
    crops: {
      suitable: ["Wheat", "Rice", "Sugarcane", "Potato"],
      alternative: ["Mustard", "Peas"],
      avoid: ["Coconut"]
    }
  },
  "Punjab": {
    core: { ph: 8.0, ec: 0.7, oc: 0.45 },
    nutrients: { n: 140, p: 16, k: 230, s: 14, zn: 0.55, b: 0.45, fe: 4.5, mn: 3.2, cu: 0.75 },
    physical: { texture: "Sandy Loam", color: "Light Brown", bulk_density: 1.45, porosity: 39, infiltration: 20, water_holding: 42 },
    suggestions: ["Crop residue management", "Micro-nutrient spray"],
    crops: {
      suitable: ["Wheat", "Rice", "Cotton", "Maize"],
      alternative: ["Kinnow", "Sunflower"],
      avoid: ["Coffee"]
    }
  },
  "Haryana": {
    core: { ph: 7.9, ec: 0.65, oc: 0.48 },
    nutrients: { n: 145, p: 17, k: 240, s: 14, zn: 0.58, b: 0.48, fe: 4.6, mn: 3.3, cu: 0.78 },
    physical: { texture: "Loam", color: "Brown", bulk_density: 1.42, porosity: 39, infiltration: 19, water_holding: 44 },
    suggestions: ["Use of gypsum", "Integrated nutrient management"],
    crops: {
      suitable: ["Wheat", "Rice", "Mustard", "Bajra"],
      alternative: ["Cotton", "Sugarcane"],
      avoid: ["Tea"]
    }
  },
  "Rajasthan": {
    core: { ph: 8.2, ec: 0.8, oc: 0.3 },
    nutrients: { n: 120, p: 15, k: 280, s: 12, zn: 0.5, b: 0.4, fe: 4.0, mn: 3.0, cu: 0.7 },
    physical: { texture: "Sandy", color: "Yellowish Brown", bulk_density: 1.6, porosity: 30, infiltration: 30, water_holding: 25 },
    suggestions: ["Drip irrigation mandatory", "Organic mulching"],
    crops: {
      suitable: ["Bajra", "Guar", "Mustard", "Gram"],
      alternative: ["Wheat", "Cumin"],
      avoid: ["Rice"]
    }
  },
  "Gujarat": {
    core: { ph: 7.7, ec: 0.6, oc: 0.52 },
    nutrients: { n: 155, p: 21, k: 270, s: 16, zn: 0.7, b: 0.55, fe: 5.0, mn: 3.8, cu: 0.85 },
    physical: { texture: "Sandy Loam / Black", color: "Grey/Black", bulk_density: 1.5, porosity: 36, infiltration: 16, water_holding: 50 },
    suggestions: ["Sulfur for groundnut", "Castor cake application"],
    crops: {
      suitable: ["Groundnut", "Cotton", "Castor", "Cumin"],
      alternative: ["Wheat", "Bajra"],
      avoid: ["Jute"]
    }
  },
  "West Bengal": {
    core: { ph: 6.5, ec: 0.3, oc: 0.7 },
    nutrients: { n: 185, p: 26, k: 220, s: 18, zn: 0.85, b: 0.65, fe: 6.2, mn: 4.8, cu: 1.1 },
    physical: { texture: "Alluvial / Clay", color: "Grey", bulk_density: 1.38, porosity: 44, infiltration: 15, water_holding: 52 },
    suggestions: ["Liming for acid soils", "Potash application"],
    crops: {
      suitable: ["Rice", "Jute", "Potato", "Tea"],
      alternative: ["Mustard", "Vegetables"],
      avoid: ["Bajra"]
    }
  },
  "Odisha": {
    core: { ph: 6.6, ec: 0.35, oc: 0.65 },
    nutrients: { n: 175, p: 24, k: 230, s: 17, zn: 0.8, b: 0.6, fe: 6.0, mn: 4.5, cu: 1.0 },
    physical: { texture: "Red / Laterite", color: "Red", bulk_density: 1.4, porosity: 42, infiltration: 18, water_holding: 48 },
    suggestions: ["Correct iron toxicity", "Bio-fertilizers"],
    crops: {
      suitable: ["Rice", "Pulses", "Groundnut", "Turmeric"],
      alternative: ["Cotton", "Sugarcane"],
      avoid: ["Apple"]
    }
  },
  "Bihar": {
    core: { ph: 7.5, ec: 0.5, oc: 0.55 },
    nutrients: { n: 160, p: 20, k: 240, s: 15, zn: 0.65, b: 0.5, fe: 5.0, mn: 3.8, cu: 0.8 },
    physical: { texture: "Alluvial", color: "Grey", bulk_density: 1.42, porosity: 41, infiltration: 17, water_holding: 50 },
    suggestions: ["Flood management", "Zinc application"],
    crops: {
      suitable: ["Rice", "Wheat", "Maize", "Pulses"],
      alternative: ["Sugarcane", "Jute"],
      avoid: ["Rubber"]
    }
  },
  "Kerala": {
    core: { ph: 5.5, ec: 0.2, oc: 1.2 },
    nutrients: { n: 200, p: 30, k: 200, s: 20, zn: 1.0, b: 0.8, fe: 7.0, mn: 5.5, cu: 1.5 },
    physical: { texture: "Laterite / Coastal Alluvium", color: "Red/Brown", bulk_density: 1.3, porosity: 48, infiltration: 25, water_holding: 55 },
    suggestions: ["Liming is crucial", "Magnesium application"],
    crops: {
      suitable: ["Coconut", "Rubber", "Tea", "Pepper"],
      alternative: ["Rice", "Banana"],
      avoid: ["Wheat"]
    }
  },
  "Assam": {
    core: { ph: 5.2, ec: 0.25, oc: 1.0 },
    nutrients: { n: 190, p: 28, k: 210, s: 19, zn: 0.9, b: 0.7, fe: 6.8, mn: 5.2, cu: 1.4 },
    physical: { texture: "Alluvial / Acidic", color: "Grey/Red", bulk_density: 1.35, porosity: 46, infiltration: 22, water_holding: 53 },
    suggestions: ["Liming", "Drainage improvement"],
    crops: {
      suitable: ["Tea", "Rice", "Jute", "Arecanut"],
      alternative: ["Mustard", "Sugarcane"],
      avoid: ["Cotton"]
    }
  }
};

module.exports = stateSoilDefaults;
