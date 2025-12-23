const express = require('express');
const router = express.Router();

// Mock Data for State -> District -> Oilseed Mapping
const GEO_DATA = {
    "Madhya Pradesh": {
        "Indore": ["Soybean", "Groundnut"],
        "Ujjain": ["Soybean", "Mustard"],
        "Bhopal": ["Soybean", "Linseed"],
        "Morena": ["Mustard", "Sesame"]
    },
    "Rajasthan": {
        "Jaipur": ["Mustard", "Groundnut"],
        "Bikaner": ["Groundnut", "Mustard", "Castor"],
        "Kota": ["Soybean", "Mustard"]
    },
    "Gujarat": {
        "Rajkot": ["Groundnut", "Castor", "Sesame"],
        "Junagadh": ["Groundnut", "Soybean"],
        "Banaskantha": ["Castor", "Mustard"]
    },
    "Maharashtra": {
        "Latur": ["Soybean", "Safflower"],
        "Akola": ["Soybean", "Sunflower"],
        "Solapur": ["Sunflower", "Safflower"]
    }
};

// Mock Historical Production Data (Last 5 Years) - Source: https://oilseeds.dac.gov.in/ (Simulated)
// Data structure: Year, Area (Lakh Ha), Production (Lakh Tonnes), Yield (kg/ha)
const PRODUCTION_DATA = {
    "Soybean": [
        { year: 2019, area: 113.5, production: 112.3, yield: 989 },
        { year: 2020, area: 120.1, production: 128.5, yield: 1070 },
        { year: 2021, area: 118.5, production: 129.8, yield: 1095 },
        { year: 2022, area: 125.2, production: 140.1, yield: 1119 },
        { year: 2023, area: 130.5, production: 149.8, yield: 1148 }
    ],
    "Groundnut": [
        { year: 2019, area: 48.5, production: 99.5, yield: 2051 },
        { year: 2020, area: 55.2, production: 102.1, yield: 1850 },
        { year: 2021, area: 58.1, production: 101.5, yield: 1747 },
        { year: 2022, area: 60.5, production: 115.2, yield: 1904 },
        { year: 2023, area: 62.8, production: 125.5, yield: 1998 }
    ],
    "Mustard": [
        { year: 2019, area: 68.5, production: 91.2, yield: 1331 },
        { year: 2020, area: 72.1, production: 101.5, yield: 1408 },
        { year: 2021, area: 80.5, production: 117.5, yield: 1459 },
        { year: 2022, area: 88.2, production: 128.2, yield: 1453 },
        { year: 2023, area: 95.5, production: 135.8, yield: 1422 }
    ],
    "Rapeseed & Mustard": [
        { year: 2019, area: 68.5, production: 91.2, yield: 1331 },
        { year: 2020, area: 72.1, production: 101.5, yield: 1408 },
        { year: 2021, area: 80.5, production: 117.5, yield: 1459 },
        { year: 2022, area: 88.2, production: 128.2, yield: 1453 },
        { year: 2023, area: 95.5, production: 135.8, yield: 1422 }
    ],
    "Sunflower": [
        { year: 2019, area: 2.5, production: 2.1, yield: 840 },
        { year: 2020, area: 2.8, production: 2.3, yield: 821 },
        { year: 2021, area: 2.6, production: 2.2, yield: 846 },
        { year: 2022, area: 3.1, production: 2.8, yield: 903 },
        { year: 2023, area: 3.5, production: 3.2, yield: 914 }
    ],
    "Sesame": [
        { year: 2019, area: 15.2, production: 6.8, yield: 447 },
        { year: 2020, area: 16.1, production: 7.5, yield: 466 },
        { year: 2021, area: 15.8, production: 7.2, yield: 456 },
        { year: 2022, area: 16.5, production: 8.1, yield: 491 },
        { year: 2023, area: 17.2, production: 8.5, yield: 494 }
    ],
    "Castor": [
        { year: 2019, area: 8.5, production: 18.5, yield: 2176 },
        { year: 2020, area: 9.1, production: 19.2, yield: 2110 },
        { year: 2021, area: 9.5, production: 20.5, yield: 2158 },
        { year: 2022, area: 9.8, production: 21.8, yield: 2224 },
        { year: 2023, area: 10.2, production: 22.5, yield: 2206 }
    ],
    "Linseed": [
        { year: 2019, area: 2.5, production: 1.5, yield: 600 },
        { year: 2020, area: 2.8, production: 1.7, yield: 607 },
        { year: 2021, area: 3.1, production: 1.9, yield: 613 },
        { year: 2022, area: 3.5, production: 2.2, yield: 628 },
        { year: 2023, area: 3.8, production: 2.5, yield: 658 }
    ],
    "Safflower": [
        { year: 2019, area: 0.8, production: 0.5, yield: 625 },
        { year: 2020, area: 0.9, production: 0.6, yield: 667 },
        { year: 2021, area: 0.7, production: 0.4, yield: 571 },
        { year: 2022, area: 0.8, production: 0.5, yield: 625 },
        { year: 2023, area: 0.9, production: 0.6, yield: 667 }
    ],
    "Niger": [
        { year: 2019, area: 1.5, production: 0.5, yield: 333 },
        { year: 2020, area: 1.6, production: 0.6, yield: 375 },
        { year: 2021, area: 1.4, production: 0.5, yield: 357 },
        { year: 2022, area: 1.5, production: 0.6, yield: 400 },
        { year: 2023, area: 1.6, production: 0.7, yield: 438 }
    ],
    "Oil Palm": [
        { year: 2019, area: 3.5, production: 280.0, yield: 8000 },
        { year: 2020, area: 3.8, production: 310.0, yield: 8158 },
        { year: 2021, area: 4.2, production: 350.0, yield: 8333 },
        { year: 2022, area: 4.8, production: 410.0, yield: 8542 },
        { year: 2023, area: 5.5, production: 480.0, yield: 8727 }
    ]
};

// Get all states
router.get('/states', (req, res) => {
    res.json(Object.keys(GEO_DATA));
});

// Get districts for a state
router.get('/districts/:state', (req, res) => {
    const state = req.params.state;
    if (GEO_DATA[state]) {
        res.json(Object.keys(GEO_DATA[state]));
    } else {
        res.status(404).json({ error: "State not found" });
    }
});

// Get oilseeds for a district
router.get('/oilseeds/:state/:district', (req, res) => {
    const { state, district } = req.params;
    if (GEO_DATA[state] && GEO_DATA[state][district]) {
        res.json(GEO_DATA[state][district]);
    } else {
        res.status(404).json({ error: "District not found" });
    }
});

// Get production analytics for a crop
router.get('/analytics/production/:crop', (req, res) => {
    const crop = req.params.crop;
    let data = PRODUCTION_DATA[crop];

    // Fallback: Generate random data if crop not found
    if (!data) {
        data = [
            { year: 2019, area: 10, production: 12, yield: 1200 },
            { year: 2020, area: 11, production: 13, yield: 1181 },
            { year: 2021, area: 12, production: 14, yield: 1166 },
            { year: 2022, area: 13, production: 16, yield: 1230 },
            { year: 2023, area: 14, production: 18, yield: 1285 }
        ];
    }

    // Add some random noise to simulate district-specific variations if needed
    const variedData = data.map(d => ({
        year: d.year,
        area: +(d.area * (0.9 + Math.random() * 0.2)).toFixed(2),
        production: +(d.production * (0.9 + Math.random() * 0.2)).toFixed(2),
        yield: +(d.yield * (0.95 + Math.random() * 0.1)).toFixed(0)
    }));
    res.json(variedData);
});

module.exports = router;
