const { readDb } = require('../utils/jsonDb');
const blockchainService = require('../blockchain/BlockchainService');

// Mock priority zones
const priorityZones = ['Indore', 'Ujjain', 'Dewas', 'Sehore', 'Bhopal', 'Vidisha'];

exports.getPerformanceScore = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        const db = readDb();
        const user = db.users.find(u => u._id === userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let score = 50; // Base score
        const breakdown = [];

        // Rule 1: +10 points for using 'Crop Advisory'
        // Simulation: Assume if they have cropDetails, they used advisory
        if (user.cropDetails && user.cropDetails.length > 0) {
            score += 10;
            breakdown.push({ rule: 'Crop Advisory Usage', points: 10 });
        }

        // Rule 2: +20 points for 'Traceable Sales'
        // Check blockchain for any blocks with this farmerId
        const chain = blockchainService.chain;
        const hasTraceableSales = chain.some(block => 
            block.data && (block.data.farmerId === userId || block.data.farmerId === user.name)
        );

        if (hasTraceableSales) {
            score += 20;
            breakdown.push({ rule: 'Traceable Sales (Blockchain Verified)', points: 20 });
        }

        // Rule 3: +5 points for 'Timely Harvest'
        // Simulation: Randomly award for now, or check dates
        const timelyHarvest = true; // Simulated
        if (timelyHarvest) {
            score += 5;
            breakdown.push({ rule: 'Timely Harvest History', points: 5 });
        }

        // Rule 4: +15 points for NMEO-OP Priority Zone
        // Assuming user.location is a string like "Indore, MP" or an object
        let district = '';
        if (typeof user.location === 'string') {
            district = user.location.split(',')[0].trim();
        } else if (user.location && user.location.district) {
            district = user.location.district;
        }

        if (district && priorityZones.includes(district)) {
            score += 15;
            breakdown.push({ rule: 'NMEO-OP Priority District Bonus', points: 15 });
        }

        // Determine Eligibility
        const eligibleForPremium = score > 80;
        const creditLimit = eligibleForPremium ? 500000 : 200000; // Increased limits for realism

        res.json({
            score,
            breakdown,
            eligibleForPremium,
            creditLimit,
            currency: 'INR'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.applyForScheme = (req, res) => {
    // Mock application process
    res.json({ 
        msg: 'Application for NMEO-OP Scheme submitted successfully.',
        applicationId: 'NMEO-' + Math.floor(Math.random() * 10000)
    });
};