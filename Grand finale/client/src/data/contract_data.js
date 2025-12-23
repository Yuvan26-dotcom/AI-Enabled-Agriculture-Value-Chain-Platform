export const contractTemplates = [
  {
    id: 'soybean_mp',
    crop: 'Soybean',
    variety: 'Yellow Soybean (Grade A)',
    deliveryLocation: 'Indore/Dewas (Madhya Pradesh)',
    qualitySpecs: {
      oilContent: '> 18%',
      moisture: '< 10%',
      foreignMatter: '< 2%',
      damage: '< 2%'
    },
    deliveryLogic: 'Ex-Warehouse',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: '2% deduction for every 1% drop in Oil Content',
    forceMajeure: 'Contract void in case of notified natural calamity'
  },
  {
    id: 'mustard_rj',
    crop: 'Rapeseed & Mustard',
    variety: 'RM-Seed (FAQ)',
    deliveryLocation: 'Jaipur/Alwar (Rajasthan)',
    qualitySpecs: {
      oilContent: '> 42%',
      moisture: '< 8%',
      foreignMatter: '< 2%',
      erucicAcid: '< 2%'
    },
    deliveryLogic: 'Ex-Mandi',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: '2% deduction for every 1% drop in Oil Content',
    forceMajeure: 'Contract void in case of notified natural calamity'
  },
  {
    id: 'groundnut_gj',
    crop: 'Groundnut',
    variety: 'Bold/Java',
    deliveryLocation: 'Rajkot/Gondal (Gujarat)',
    qualitySpecs: {
      moisture: '< 8%',
      shelling: '> 70%',
      foreignMatter: '< 2%',
      oilContent: '> 45%'
    },
    deliveryLogic: 'Ex-Warehouse',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: '1.5% deduction for every 1% drop in Shelling %',
    forceMajeure: 'Contract void in case of notified natural calamity'
  },
  {
    id: 'sunflower_ka',
    crop: 'Sunflower',
    variety: 'Standard Grade',
    deliveryLocation: 'Raichur/Davangere (Karnataka)',
    qualitySpecs: {
      oilContent: '> 40%',
      moisture: '< 9%',
      foreignMatter: '< 2%'
    },
    deliveryLogic: 'Ex-Mandi',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: '2% deduction for every 1% drop in Oil Content',
    forceMajeure: 'Contract void in case of notified natural calamity'
  },
  {
    id: 'sesame_gj',
    crop: 'Sesame',
    variety: '99/1/1 Grade',
    deliveryLocation: 'Unjha (Gujarat)',
    qualitySpecs: {
      purity: '99%',
      oilContent: '> 48%',
      moisture: '< 6%',
      ffa: '< 2%'
    },
    deliveryLogic: 'Ex-Warehouse',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: 'Reject if purity < 98%',
    forceMajeure: 'Contract void in case of notified natural calamity'
  },
  {
    id: 'castor_gj',
    crop: 'Castor',
    variety: 'Commercial Grade',
    deliveryLocation: 'Palanpur/Deesa (Gujarat)',
    qualitySpecs: {
      oilContent: '> 47%',
      moisture: '< 8%',
      foreignMatter: '< 1%',
      damagedSeeds: '< 2%'
    },
    deliveryLogic: 'Ex-Warehouse',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: '1% deduction for every 1% drop in Oil Content',
    forceMajeure: 'Contract void in case of notified natural calamity'
  },
  {
    id: 'niger_cg',
    crop: 'Niger',
    variety: 'Standard',
    deliveryLocation: 'Jagdalpur (Chhattisgarh)',
    qualitySpecs: {
      foreignMatter: '< 1%',
      moisture: '< 9%',
      oilContent: '> 35%'
    },
    deliveryLogic: 'Ex-Mandi',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: 'Reject if Foreign Matter > 2%',
    forceMajeure: 'Contract void in case of notified natural calamity'
  },
  {
    id: 'safflower_mh',
    crop: 'Safflower',
    variety: 'Kardi',
    deliveryLocation: 'Latur (Maharashtra)',
    qualitySpecs: {
      oilContent: '> 30%',
      moisture: '< 10%',
      foreignMatter: '< 2%'
    },
    deliveryLogic: 'Ex-Mandi',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: 'Pro-rata deduction for lower oil content',
    forceMajeure: 'Contract void in case of notified natural calamity'
  },
  {
    id: 'oilpalm_ap',
    crop: 'Oil Palm',
    variety: 'Fresh Fruit Bunches',
    deliveryLocation: 'Godavari (Andhra Pradesh)',
    qualitySpecs: {
      condition: 'Fresh (Process within 24hrs)',
      ripeFruit: '> 90%',
      stalkLength: '< 5cm'
    },
    deliveryLogic: 'Ex-Mill Gate',
    paymentTerms: 'T+2 Settlement',
    penaltyClause: 'Reject if processed > 24hrs after harvest',
    forceMajeure: 'Contract void in case of notified natural calamity'
  }
];
