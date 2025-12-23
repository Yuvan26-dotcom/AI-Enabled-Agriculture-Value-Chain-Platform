const blockchainService = require('../blockchain/BlockchainService');
const crypto = require('crypto');

// 1. Farmer Sells Produce -> Create Genesis for Batch
exports.createBatch = (req, res) => {
    try {
        const { farmerId, crop, harvestDate, oilContent } = req.body;

        // Generate Batch ID
        const batchId = crypto.randomUUID();

        // Create QR Code Data String
        const qrData = JSON.stringify({
            farmerId,
            crop,
            harvestDate,
            oilContent,
            batchId
        });

        // Create Digital Passport (Hash of the initial data)
        const digitalPassport = crypto.createHash('sha256').update(qrData).digest('hex');

        const data = {
            action: 'HARVEST_SOLD',
            batchId,
            farmerId,
            crop,
            harvestDate,
            oilContent,
            digitalPassport,
            qrDataString: qrData
        };

        // Add to Blockchain
        const newBlock = blockchainService.addBlock(data);

        res.json({
            msg: 'Batch created successfully',
            batchId,
            qrCodeString: qrData,
            digitalPassport,
            blockIndex: newBlock.index
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 2. Processor Scans & Adds Data
exports.addProcessingData = (req, res) => {
    try {
        const { batchId, processorId, processingDate, details } = req.body;

        const data = {
            action: 'PROCESSED',
            batchId,
            processorId,
            processingDate,
            details // e.g., "Refined", "Packed"
        };

        const newBlock = blockchainService.addBlock(data);

        res.json({
            msg: 'Processing data appended to chain',
            block: newBlock
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getTrace = (req, res) => {
    try {
        const { batchId } = req.params;
        
        // Verify chain integrity first
        const isChainValid = blockchainService.verifyChain();
        
        // Get history
        const history = blockchainService.getTraceHistory(batchId);

        if (history.length === 0) {
            return res.status(404).json({ msg: 'No history found for this Batch ID' });
        }

        res.json({
            batchId,
            ledgerIntegrity: isChainValid ? 'VERIFIED' : 'COMPROMISED',
            history
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addTraceEntry = (req, res) => {
    try {
        const { batchId, farmerId, harvestDate, qualityGrade, processorId, currentStatus } = req.body;
        
        const data = { 
            batchId, 
            farmerId, 
            harvestDate, 
            qualityGrade, 
            processorId, 
            currentStatus 
        };

        const newBlock = blockchainService.addBlock(data);
        
        res.json({
            msg: 'Block added to chain successfully',
            block: newBlock
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};