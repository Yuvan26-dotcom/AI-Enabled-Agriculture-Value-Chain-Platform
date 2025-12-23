const generateCluster = (centerLat, centerLng, count, spread, severityMin, severityMax) => {
    const points = [];
    for (let i = 0; i < count; i++) {
        points.push({
            lat: centerLat + (Math.random() - 0.5) * spread,
            lng: centerLng + (Math.random() - 0.5) * spread,
            severity: parseFloat((severityMin + Math.random() * (severityMax - severityMin)).toFixed(2)),
            pestType: 'Aphid'
        });
    }
    return points;
};

// Cluster 1: Tijara Village (High Intensity)
// Concentrated spread (0.02 degrees ~ 2km), High Severity (0.8 - 1.0)
const highIntensityCluster = generateCluster(27.5530, 76.6346, 30, 0.02, 0.8, 1.0);

// Cluster 2: Surrounding Areas (Low Intensity)
// Scattered spread (0.1 degrees ~ 10km), Low Severity (0.2 - 0.5)
// Offset by ~10km (approx 0.09 deg)
const lowIntensityCluster = generateCluster(27.6200, 76.7000, 20, 0.1, 0.2, 0.5);

const pestHeatmapData = [...highIntensityCluster, ...lowIntensityCluster];

module.exports = pestHeatmapData;
