const NotificationService = require('../services/NotificationService');
const PestRiskEngine = require('../services/PestRiskEngine');
const { readDb } = require('../utils/jsonDb');

exports.simulatePestAttack = async (req, res) => {
    try {
        // Using the authenticated user's ID
        const userId = req.user.id;
        const db = readDb();
        const user = db.users.find(u => u._id === userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Use the user's location or a default if not set
        // Defaulting to Indore coordinates for simulation if missing
        let lat = 22.7196;
        let lon = 75.8577;

        if (user.location && user.location.coordinates) {
             lat = user.location.coordinates[1];
             lon = user.location.coordinates[0];
        }

        // Calculate Risk using the new Engine
        const riskAnalysis = await PestRiskEngine.calculateRisk(lat, lon);
        
        // Trigger the notification service if risk is HIGH
        let result = { success: true, alert: `Risk Analysis: ${riskAnalysis.riskLevel}` };
        
        if (riskAnalysis.riskLevel === 'HIGH') {
             result = await NotificationService.checkWeatherAndNotify(userId, 'pest');
             // Append source info to the alert
             result.alert += ` (Source: ${riskAnalysis.source})`;
        }
        
        if (result.success) {
            res.json({ 
                msg: 'Simulation Successful', 
                alertContent: result.alert || `Current Risk Level: ${riskAnalysis.riskLevel}`,
                riskDetails: riskAnalysis
            });
        } else {
            res.status(500).json({ msg: 'Simulation Failed', error: result.error });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};