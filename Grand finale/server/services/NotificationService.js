const { readDb } = require('../utils/jsonDb');

class NotificationService {
    
    async checkWeatherAndNotify(farmerId, condition) {
        try {
            const db = readDb();
            const farmer = db.users.find(u => u._id === farmerId);
            
            if (!farmer) {
                console.log(`Farmer with ID ${farmerId} not found.`);
                return { success: false, message: "Farmer not found" };
            }

            let message = '';
            // Logic: If 'Rain' > 80% or 'Pest Risk' is High
            if (condition === 'rain') {
                let district = 'your area';
                if (farmer.location) {
                    if (typeof farmer.location === 'string') {
                        district = farmer.location.split(',')[0];
                    } else if (farmer.location.district) {
                        district = farmer.location.district;
                    }
                }
                message = `ALERT: ${farmer.name}, Heavy Rain (>80%) predicted in ${district}. Secure your harvested crops immediately. - Biometrix Advisory`;
            } else if (condition === 'pest') {
                message = `ALERT: ${farmer.name}, High Pest Risk detected in your area. Spray Neem Oil today to prevent damage. - Biometrix Advisory`;
            }

            if (message) {
                // Simulate sending an SMS
                console.log("\n================ [ SMS GATEWAY SIMULATION ] ================");
                console.log(`TO: ${farmer.name} (${farmer.email})`);
                console.log(`BODY: ${message}`);
                console.log("STATUS: SENT ✅");
                console.log("============================================================\n");
            }
            
            return { success: true, alert: message };

        } catch (error) {
            console.error("Notification Service Error:", error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new NotificationService();