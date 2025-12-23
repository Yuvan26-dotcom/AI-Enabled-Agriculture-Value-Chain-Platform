// Simulates integration with the National AgriStack (IDEA - India Digital Ecosystem of Agriculture)
exports.fetchFarmerID = async (aadhaar) => {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Mock Validation
            if (!aadhaar || aadhaar.length !== 12) {
                return reject(new Error("Invalid Aadhaar Number"));
            }

            // Mock Database of AgriStack
            const mockRegistry = {
                '123456789012': {
                    farmerId: 'AGRI-IN-MP-001',
                    name: 'Ramesh Kumar',
                    landRecordId: 'LR-778899',
                    linkedFPO: 'Malwa Soybean FPO',
                    state: 'Madhya Pradesh',
                    district: 'Indore',
                    totalAcreage: 5.5
                },
                '987654321098': {
                    farmerId: 'AGRI-IN-MH-045',
                    name: 'Suresh Patil',
                    landRecordId: 'LR-112233',
                    linkedFPO: 'Vidarbha Cotton Growers',
                    state: 'Maharashtra',
                    district: 'Nagpur',
                    totalAcreage: 3.2
                }
            };

            const data = mockRegistry[aadhaar];

            if (data) {
                resolve(data);
            } else {
                // Return a generic mock for any other valid 12-digit number for demo purposes
                resolve({
                    farmerId: `AGRI-IN-GEN-${Math.floor(Math.random() * 1000)}`,
                    name: 'Demo Farmer',
                    landRecordId: `LR-${Math.floor(Math.random() * 100000)}`,
                    linkedFPO: 'National Oilseeds FPO',
                    state: 'Madhya Pradesh',
                    district: 'Bhopal',
                    totalAcreage: 2.0
                });
            }
        }, 800); // 800ms delay
    });
};