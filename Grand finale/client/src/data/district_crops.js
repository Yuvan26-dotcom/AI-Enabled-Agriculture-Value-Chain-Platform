export const DISTRICT_CROP_MAPPING = {
  // Madhya Pradesh (Soybean Bowl)
  'Indore': ['Soybean', 'Wheat', 'Chickpea'], // Wheat/Chickpea are Rabi, but keeping oilseeds focus if possible, but users might expect major crops. Sticking to Oilseeds per project scope.
  'Indore': ['Soybean', 'Sunflower'],
  'Ujjain': ['Soybean', 'Linseed'],
  'Dewas': ['Soybean', 'Mustard'],
  'Sehore': ['Soybean', 'Mustard'],
  'Bhopal': ['Soybean', 'Linseed'],
  'Vidisha': ['Soybean', 'Mustard', 'Linseed'],
  'Harda': ['Soybean', 'Mustard'],

  // Rajasthan (Mustard Belt)
  'Jaipur': ['Rapeseed & Mustard', 'Groundnut'],
  'Alwar': ['Rapeseed & Mustard', 'Sesame'],
  'Kota': ['Soybean', 'Rapeseed & Mustard'],
  'Baran': ['Soybean', 'Rapeseed & Mustard', 'Sesame'],
  'Tonk': ['Rapeseed & Mustard', 'Groundnut'],
  'Bharatpur': ['Rapeseed & Mustard', 'Sesame'],

  // Gujarat (Groundnut & Castor)
  'Rajkot': ['Groundnut', 'Castor', 'Sesame'],
  'Junagadh': ['Groundnut', 'Castor', 'Sesame'],
  'Amreli': ['Groundnut', 'Sesame', 'Cottonseed'],
  'Jamnagar': ['Groundnut', 'Castor'],
  'Bhavnagar': ['Groundnut', 'Sesame', 'Cottonseed'],

  // Maharashtra
  'Latur': ['Soybean', 'Safflower', 'Sunflower'],
  'Akola': ['Soybean', 'Cottonseed', 'Safflower'],
  'Amravati': ['Soybean', 'Cottonseed', 'Safflower'],
  'Nagpur': ['Soybean', 'Linseed', 'Cottonseed'],
  'Nanded': ['Soybean', 'Cottonseed'],

  // Karnataka
  'Dharwad': ['Groundnut', 'Soybean', 'Safflower'],
  'Belagavi': ['Soybean', 'Groundnut', 'Sunflower'],
  'Haveri': ['Groundnut', 'Sunflower', 'Safflower'],
  'Gadag': ['Sunflower', 'Groundnut', 'Safflower'],
  'Bagalkot': ['Sunflower', 'Groundnut'],

  // Andhra Pradesh
  'Anantapur': ['Groundnut', 'Sunflower'],
  'Kurnool': ['Groundnut', 'Sunflower', 'Castor'],
  'Chittoor': ['Groundnut', 'Sesame'],
  'Kadapa': ['Groundnut', 'Sunflower', 'Sesame'],

  // Telangana
  'Adilabad': ['Soybean', 'Cottonseed'],
  'Nizamabad': ['Soybean', 'Sunflower', 'Sesame'],
  'Karimnagar': ['Cottonseed', 'Sesame', 'Groundnut'],
  'Warangal': ['Cottonseed', 'Groundnut', 'Sesame'],

  // Tamil Nadu
  'Tiruvannamalai': ['Groundnut', 'Sesame'],
  'Vellore': ['Groundnut', 'Sesame', 'Coconut'],
  'Villupuram': ['Groundnut', 'Sesame', 'Cashew'],
  'Erode': ['Groundnut', 'Sesame', 'Coconut'],

  // Uttar Pradesh
  'Agra': ['Rapeseed & Mustard', 'Sesame'],
  'Mathura': ['Rapeseed & Mustard'],
  'Aligarh': ['Rapeseed & Mustard'],
  'Hathras': ['Rapeseed & Mustard'],

  // Haryana
  'Hisar': ['Rapeseed & Mustard', 'Cottonseed'],
  'Sirsa': ['Rapeseed & Mustard', 'Cottonseed'],
  'Bhiwani': ['Rapeseed & Mustard', 'Cottonseed'],
  'Fatehabad': ['Rapeseed & Mustard', 'Sunflower'],

  // Punjab
  'Bathinda': ['Rapeseed & Mustard', 'Cottonseed'],
  'Mansa': ['Rapeseed & Mustard', 'Cottonseed'],
  'Sangrur': ['Rapeseed & Mustard', 'Sunflower'],
  'Patiala': ['Rapeseed & Mustard', 'Sunflower'],

  // West Bengal
  'Nadia': ['Rapeseed & Mustard', 'Sesame', 'Linseed'],
  'Murshidabad': ['Rapeseed & Mustard', 'Sesame'],
  'Hooghly': ['Sesame', 'Rapeseed & Mustard'],
  'Burdwan': ['Rapeseed & Mustard', 'Sesame'],

  // Odisha
  'Mayurbhanj': ['Groundnut', 'Rapeseed & Mustard', 'Niger'],
  'Keonjhar': ['Groundnut', 'Rapeseed & Mustard', 'Niger'],
  'Sundargarh': ['Groundnut', 'Rapeseed & Mustard', 'Sesame'],
  'Sambalpur': ['Sesame', 'Rapeseed & Mustard'],

  // Chhattisgarh
  'Raipur': ['Soybean', 'Groundnut', 'Linseed'],
  'Durg': ['Soybean', 'Linseed'],
  'Rajnandgaon': ['Soybean', 'Linseed'],
  'Bilaspur': ['Mustard', 'Linseed', 'Sesame'],

  // Bihar
  'Begusarai': ['Rapeseed & Mustard', 'Linseed', 'Sunflower'],
  'Khagaria': ['Rapeseed & Mustard', 'Sunflower'],
  'Samastipur': ['Rapeseed & Mustard', 'Linseed'],
  'Muzaffarpur': ['Rapeseed & Mustard', 'Linseed'],

  // Jharkhand
  'Ranchi': ['Rapeseed & Mustard', 'Niger', 'Linseed'],
  'Hazaribagh': ['Rapeseed & Mustard', 'Niger'],
  'Giridih': ['Rapeseed & Mustard', 'Niger'],
  'Palamu': ['Rapeseed & Mustard', 'Sesame', 'Linseed'],

  // Assam
  'Nagaon': ['Rapeseed & Mustard', 'Sesame'],
  'Sonitpur': ['Rapeseed & Mustard', 'Sesame'],
  'Darrang': ['Rapeseed & Mustard', 'Sesame', 'Linseed'],
  'Barpeta': ['Rapeseed & Mustard', 'Linseed']
};
