const warehouses = [
    {
        id: 'WH-IND-01',
        name: 'Indore Central Storage',
        location: { lat: 22.7196, lng: 75.8577 },
        capacity: 5000, // Tons
        filled: 85, // Percentage
        status: 'Critical',
        type: 'Dry Storage'
    },
    {
        id: 'WH-DEW-02',
        name: 'Dewas Cold Chain',
        location: { lat: 22.9676, lng: 76.0534 },
        capacity: 2000, // Tons
        filled: 30, // Percentage
        status: 'Available',
        type: 'Cold Storage'
    }
];

const activeTrips = [
    {
        tripId: 'TRIP-MP09-8821',
        truckNumber: 'MP-09-GH-2024',
        driver: 'Raju',
        status: 'En Route to Warehouse',
        load: '80 Quintals (Soybean)',
        route: [
            { name: 'Ujjain (Farmer Cluster 1)', lat: 23.1793, lng: 75.7849, type: 'pickup' },
            { name: 'Sanwer (Farmer Cluster 2)', lat: 22.9771, lng: 75.8319, type: 'pickup' },
            { name: 'Indore Central Storage', lat: 22.7196, lng: 75.8577, type: 'dropoff' }
        ],
        eGatePass: {
            passId: 'GP-998',
            timeSlot: '14:00-15:00',
            dockNumber: 4,
            qrCodeData: 'GP-998|MP-09-GH-2024|14:00|Dock-4'
        }
    }
];

module.exports = { warehouses, activeTrips };
