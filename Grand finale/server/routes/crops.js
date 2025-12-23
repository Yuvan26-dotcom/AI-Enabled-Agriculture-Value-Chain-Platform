const express = require('express');
const router = express.Router();
const { crops, marketData } = require('../seed_data');
// const Crop = require('../models/Crop'); // Removed for JSON DB

// GET /api/crops - Fetch all oilseeds
router.get('/crops', async (req, res) => {
  try {
    // For the JSON DB version, we can just return the seed data directly
    // as we don't need to persist dynamic crop types for this demo.
    // If we wanted to, we could read from db.json
    
    res.json(crops);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/market-prices - Return dynamic market data
router.get('/market-prices', (req, res) => {
  // Simulate real-time fluctuations
  const dynamicData = marketData.map(item => {
    const fluctuation = (Math.random() - 0.5) * 50; // +/- 25 rupees
    const newPrice = Math.round(item.price + fluctuation);
    
    let trend = 'stable';
    let change = '0%';
    
    if (newPrice > item.price) {
      trend = 'up';
      const percent = ((newPrice - item.price) / item.price * 100).toFixed(2);
      change = `+${percent}%`;
    } else if (newPrice < item.price) {
      trend = 'down';
      const percent = ((item.price - newPrice) / item.price * 100).toFixed(2);
      change = `-${percent}%`;
    }

    return {
      ...item,
      price: newPrice,
      trend: trend,
      change: change,
      lastUpdated: new Date().toISOString()
    };
  });
  
  res.json(dynamicData);
});

module.exports = router;