const { readDb, writeDb } = require('../utils/jsonDb');
const crypto = require('crypto');
const npopBodies = require('../data/npop_bodies');
const blockchainService = require('../blockchain/BlockchainService');

// Mock APEDA/NPOP Verification Database
const VALID_CERTIFICATES = [
    'ORG-123456',
    'NPOP-987654',
    'APEDA-555555',
    'BIO-2025-001'
];

exports.getAllProduce = async (req, res) => {
    try {
        const db = readDb();
        const produce = db.produce || [];
        res.json(produce);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createProduce = async (req, res) => {
    try {
        const { cropName, quantity, pricePerQuintal, type, certificateNumber } = req.body;
        
        // Basic validation
        if (!cropName || !quantity || !pricePerQuintal || !type) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        const db = readDb();
        
        // Initialize produce array if it doesn't exist
        if (!db.produce) {
            db.produce = [];
        }

        let verificationStatus = 'Not Applicable';
        let verifiedCertificateNumber = null;

        if (type === 'Organic') {
            if (certificateNumber) {
                // Simulate Verification Logic
                // 1. Check against hardcoded valid list
                // 2. Check if it contains a valid NPOP Accreditation Number
                
                const isKnownValid = VALID_CERTIFICATES.includes(certificateNumber) || certificateNumber.startsWith('TEST-OK');
                
                // Check if the certificate number contains a valid NPOP body code (e.g. NPOP/NAB/001)
                const matchedBody = npopBodies.find(body => certificateNumber.includes(body.accreditationNumber));
                
                if (isKnownValid || matchedBody) {
                    verificationStatus = 'Verified';
                    verifiedCertificateNumber = certificateNumber;
                } else {
                    verificationStatus = 'Pending Verification';
                    verifiedCertificateNumber = certificateNumber;
                }
            } else {
                verificationStatus = 'No Certificate';
            }
        }

        // Generate Batch ID for Traceability
        const batchId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        
        // Create Genesis Block in Blockchain
        const qrData = JSON.stringify({
            farmerId: req.user ? req.user.id : 'guest',
            crop: cropName,
            harvestDate: new Date().toISOString(),
            batchId
        });
        
        const digitalPassport = crypto.createHash('sha256').update(qrData).digest('hex');

        const blockchainData = {
            action: 'HARVEST_SOLD',
            batchId,
            farmerId: req.user ? req.user.id : 'guest',
            crop: cropName,
            harvestDate: new Date().toISOString(),
            quantity: Number(quantity),
            digitalPassport,
            qrDataString: qrData
        };

        blockchainService.addBlock(blockchainData);

        const newProduce = {
            id: batchId, // Use batchId as the main ID for simplicity
            batchId,
            farmerId: req.user ? req.user.id : 'guest',
            farmerName: req.user ? req.user.name : 'Guest Farmer',
            cropName,
            quantity: Number(quantity),
            pricePerQuintal: Number(pricePerQuintal),
            type,
            certificateNumber: verifiedCertificateNumber,
            verificationStatus,
            createdAt: new Date().toISOString()
        };

        db.produce.unshift(newProduce); // Add to top
        writeDb(db);

        res.json(newProduce);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateNumber } = req.body;
        
        if (!certificateNumber) {
            return res.status(400).json({ msg: 'Certificate number is required' });
        }

        // Simulate Verification
        const isKnownValid = VALID_CERTIFICATES.includes(certificateNumber) || certificateNumber.startsWith('TEST-OK');
        const matchedBody = npopBodies.find(body => certificateNumber.includes(body.accreditationNumber));

        if (isKnownValid || matchedBody) {
            res.json({ 
                valid: true, 
                status: 'Verified', 
                details: {
                    holder: 'Sample Farmer',
                    expiry: '2026-12-31',
                    body: matchedBody ? matchedBody.name : 'NPOP India',
                    accreditation: matchedBody ? matchedBody.accreditationNumber : 'N/A'
                }
            });
        } else {
            res.json({ 
                valid: false, 
                status: 'Invalid', 
                msg: 'Certificate not found in APEDA database or invalid format' 
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
