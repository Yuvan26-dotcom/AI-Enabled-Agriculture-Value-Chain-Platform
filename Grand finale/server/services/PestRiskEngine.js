const PestReport = require('../models/PestReport');

class PestRiskEngine {
    
    // Calculate risk for a specific location (lat, lon)
    async calculateRisk(latitude, longitude) {
        // 1. Weather Factor (60%) - Simulated based on random/mock data for now
        // In a real app, fetch from OpenWeatherMap API
        const weatherScore = this.getWeatherRiskScore(); 

        // 2. Community Factor (40%) - Check nearby reports
        const communityRisk = await this.getCommunityRisk(latitude, longitude);

        let finalRiskLevel = 'LOW';
        let source = 'Weather Analysis';

        // Logic: If neighbor reported, instantly boost to HIGH
        if (communityRisk.hasNearbyReports) {
            finalRiskLevel = 'HIGH';
            source = `Validated by ${communityRisk.count} nearby farmers`;
        } else {
            // Standard Weighted Average
            // Weather (0-100) * 0.6 + Community (0-100) * 0.4
            // Since community is 0 if no reports, it's just weather * 0.6
            const totalScore = (weatherScore * 0.6) + (communityRisk.score * 0.4);
            
            if (totalScore > 70) finalRiskLevel = 'HIGH';
            else if (totalScore > 40) finalRiskLevel = 'MEDIUM';
        }

        return {
            riskLevel: finalRiskLevel,
            source: source,
            details: {
                weatherScore,
                communityReports: communityRisk.count
            }
        };
    }

    getWeatherRiskScore() {
        // Mock logic: High humidity + moderate temp = High Risk
        // Returning a random score for simulation
        return Math.floor(Math.random() * 100);
    }

    async getCommunityRisk(lat, lon) {
        // Find reports within 5km in the last 48 hours
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        
        const reports = await PestReport.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                    },
                    $maxDistance: 5000 // 5km in meters
                }
            },
            timestamp: { $gte: fortyEightHoursAgo }
        });

        const count = reports.length;
        let score = 0;
        
        if (count > 0) score = 100; // Immediate high risk if reports exist
        
        return {
            hasNearbyReports: count > 0,
            count: count,
            score: score
        };
    }
}

module.exports = new PestRiskEngine();
