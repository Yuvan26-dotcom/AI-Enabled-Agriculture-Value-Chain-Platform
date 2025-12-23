const crops = [
  {
    name: "Soybean",
    variety: "JS-335",
    duration: "95-100 days",
    oilContent: "18-20%",
    suitableSoil: "Loamy, Well-drained",
    sowingSeason: "Kharif (June-July)",
    harvestSeason: "October",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Soybean.jpg/1200px-Soybean.jpg"
  },
  {
    name: "Groundnut",
    variety: "Kadiri-6",
    duration: "110-120 days",
    oilContent: "48-50%",
    suitableSoil: "Sandy Loam",
    sowingSeason: "Kharif & Rabi",
    harvestSeason: "October & April",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Peanuts.jpg/1200px-Peanuts.jpg"
  },
  {
    name: "Mustard",
    variety: "Pusa Bold",
    duration: "130-140 days",
    oilContent: "40-42%",
    suitableSoil: "Clay Loam",
    sowingSeason: "Rabi (Oct-Nov)",
    harvestSeason: "Feb-March",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Mustard_field.jpg/1200px-Mustard_field.jpg"
  },
  {
    name: "Sunflower",
    variety: "Modern",
    duration: "90-100 days",
    oilContent: "40-45%",
    suitableSoil: "Black Cotton Soil",
    sowingSeason: "All Seasons",
    harvestSeason: "90 days after sowing",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/A_sunflower.jpg/1200px-A_sunflower.jpg"
  },
  {
    name: "Sesame (Til)",
    variety: "TKG-22",
    duration: "80-90 days",
    oilContent: "48-50%",
    suitableSoil: "Sandy Loam",
    sowingSeason: "Kharif/Summer",
    harvestSeason: "September/May",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sesame_seeds.jpg/1200px-Sesame_seeds.jpg"
  },
  {
    name: "Castor",
    variety: "GCH-7",
    duration: "150-180 days",
    oilContent: "45-50%",
    suitableSoil: "Sandy Loam",
    sowingSeason: "Kharif",
    harvestSeason: "Jan-Feb",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Castor_beans.jpg/1200px-Castor_beans.jpg"
  },
  {
    name: "Safflower",
    variety: "PBNS-12",
    duration: "120-125 days",
    oilContent: "28-32%",
    suitableSoil: "Deep Black Soil",
    sowingSeason: "Rabi",
    harvestSeason: "March-April",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Safflower.jpg/1200px-Safflower.jpg"
  },
  {
    name: "Niger",
    variety: "IGP-76",
    duration: "95-105 days",
    oilContent: "35-40%",
    suitableSoil: "Red Loam",
    sowingSeason: "Kharif",
    harvestSeason: "October",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Guizotia_abyssinica.jpg/1200px-Guizotia_abyssinica.jpg"
  },
  {
    name: "Linseed",
    variety: "T-397",
    duration: "115-125 days",
    oilContent: "38-42%",
    suitableSoil: "Clay Loam",
    sowingSeason: "Rabi",
    harvestSeason: "March",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flax_flowers.jpg/1200px-Flax_flowers.jpg"
  }
];

const marketData = [
  // Soybean
  { crop: "Soybean", price: 4850, trend: "up", market: "Indore Mandi (MP)", arrival: "2500 Tons", change: "+1.5%" },
  { crop: "Soybean", price: 4780, trend: "stable", market: "Latur Mandi (Mah)", arrival: "1800 Tons", change: "0%" },
  { crop: "Soybean", price: 4920, trend: "up", market: "Kota Mandi (Raj)", arrival: "1200 Tons", change: "+2.1%" },
  
  // Groundnut
  { crop: "Groundnut", price: 6450, trend: "up", market: "Rajkot Mandi (Guj)", arrival: "1500 Tons", change: "+0.8%" },
  { crop: "Groundnut", price: 6300, trend: "down", market: "Bikaner Mandi (Raj)", arrival: "900 Tons", change: "-1.2%" },
  { crop: "Groundnut", price: 6550, trend: "stable", market: "Anantapur Mandi (AP)", arrival: "1100 Tons", change: "0%" },

  // Mustard
  { crop: "Mustard", price: 5650, trend: "up", market: "Jaipur Mandi (Raj)", arrival: "3000 Tons", change: "+1.8%" },
  { crop: "Mustard", price: 5580, trend: "stable", market: "Bharatpur Mandi (Raj)", arrival: "2200 Tons", change: "+0.2%" },
  { crop: "Mustard", price: 5700, trend: "down", market: "Hisar Mandi (Har)", arrival: "1400 Tons", change: "-0.5%" },

  // Sunflower
  { crop: "Sunflower", price: 6100, trend: "up", market: "Raichur Mandi (Kar)", arrival: "600 Tons", change: "+3.5%" },
  { crop: "Sunflower", price: 5950, trend: "stable", market: "Latur Mandi (Mah)", arrival: "450 Tons", change: "0%" },

  // Sesame
  { crop: "Sesame (Til)", price: 12800, trend: "up", market: "Unjha Mandi (Guj)", arrival: "300 Tons", change: "+4.2%" },
  { crop: "Sesame (Til)", price: 12200, trend: "down", market: "Jodhpur Mandi (Raj)", arrival: "250 Tons", change: "-1.5%" },

  // Castor
  { crop: "Castor", price: 6250, trend: "stable", market: "Patan Mandi (Guj)", arrival: "1100 Tons", change: "+0.1%" },
  { crop: "Castor", price: 6180, trend: "up", market: "Gadwal Mandi (Tel)", arrival: "500 Tons", change: "+1.2%" },

  // Safflower
  { crop: "Safflower", price: 5550, trend: "down", market: "Akola Mandi (Mah)", arrival: "200 Tons", change: "-0.8%" },
  
  // Niger
  { crop: "Niger", price: 7250, trend: "up", market: "Jagdalpur Mandi (CG)", arrival: "150 Tons", change: "+2.0%" },
  
  // Linseed
  { crop: "Linseed", price: 5950, trend: "stable", market: "Kanpur Mandi (UP)", arrival: "400 Tons", change: "0%" }
];

// NMEO-OP (National Mission on Edible Oils - Oil Palm/Oilseeds) Priority Districts
const priorityZones = [
  "Adilabad", "Khammam", "Nalgonda", // Telangana
  "West Godavari", "East Godavari", "Krishna", // Andhra Pradesh
  "Raichur", "Bellary", "Koppal", // Karnataka
  "Latur", "Nanded", "Osmanabad", // Maharashtra
  "Morena", "Bhind", "Gwalior", // MP (Mustard)
  "Bharatpur", "Alwar", "Sri Ganganagar", // Rajasthan (Mustard)
  "Indore", "Ujjain", "Dewas" // MP (Soybean)
];

module.exports = { crops, marketData, priorityZones };