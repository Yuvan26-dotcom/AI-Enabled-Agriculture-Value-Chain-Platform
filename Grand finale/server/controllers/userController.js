const { readDb, writeDb } = require('../utils/jsonDb');

exports.calculateTrustScore = async (req, res) => {
    try {
        const userId = req.user.id;
        const db = readDb();
        
        // Fetch all contracts for the user
        const contracts = db.contracts.filter(c => c.farmer === userId);

        let score = 500; // Base score

        contracts.forEach(contract => {
            if (contract.status === 'settled') {
                score += 10;
            } else if (contract.status === 'defaulted') {
                score -= 50;
            }
        });

        // Determine Badge
        let badge = 'Bronze';
        if (score >= 750) {
            badge = 'Gold';
        } else if (score >= 600) {
            badge = 'Silver';
        }

        // Update User
        const userIndex = db.users.findIndex(u => u._id === userId);
        if (userIndex !== -1) {
            db.users[userIndex].trustScore = score;
            db.users[userIndex].creditBadge = badge;
            writeDb(db);
            
            const user = db.users[userIndex];
            
            res.json({
                trustScore: user.trustScore,
                creditBadge: user.creditBadge,
                totalContracts: contracts.length,
                breakdown: {
                    settled: contracts.filter(c => c.status === 'settled').length,
                    defaulted: contracts.filter(c => c.status === 'defaulted').length
                }
            });
        } else {
             res.status(404).json({ msg: 'User not found' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getFarmers = async (req, res) => {
    try {
        const { crop } = req.query;
        const db = readDb();
        
        // Filter users who are farmers
        let farmers = db.users.filter(u => u.role === 'farmer');

        // If crop is specified, filter farmers who have that crop in their details
        // Note: This assumes user.cropDetails is populated. 
        // If not, we might just return all farmers for the demo or check listings.
        if (crop) {
            farmers = farmers.filter(f => 
                f.cropDetails && f.cropDetails.some(c => c.cropName.toLowerCase() === crop.toLowerCase())
            );
        }

        // Map to safe public profile
        const publicFarmers = farmers.map(f => ({
            id: f._id,
            name: f.name,
            location: `${f.location?.district || 'Unknown'}, ${f.location?.state || ''}`,
            rating: (f.trustScore / 200).toFixed(1), // Mock rating from trust score
            coords: [22.7196 + (Math.random() - 0.5), 75.8577 + (Math.random() - 0.5)], // Mock coords near Indore
            crop: crop || 'Soybean',
            quantity: 'Available'
        }));

        res.json(publicFarmers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};