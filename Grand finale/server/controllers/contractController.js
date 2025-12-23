const { readDb, writeDb } = require('../utils/jsonDb');
const { addToLedger, verifyInLedger } = require('../utils/blockchain');
const crypto = require('crypto');

exports.createContract = async (req, res) => {
    try {
        const { counterparty, crop, quantity, price, maturityDate } = req.body;
        const db = readDb();

        // Assuming req.user.id comes from an auth middleware
        const newContract = {
            _id: crypto.randomUUID(),
            farmer: req.user.id,
            counterparty,
            crop,
            quantity,
            price,
            maturityDate,
            status: 'active', // Default status
            createdAt: new Date().toISOString()
        };

        // Add to Blockchain Ledger
        const contractHash = addToLedger(newContract);

        // Update contract with the hash
        newContract.contractHash = contractHash;

        db.contracts.push(newContract);
        writeDb(db);

        res.json(newContract);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyContract = async (req, res) => {
    try {
        const { hash } = req.params;
        const block = verifyInLedger(hash);

        if (!block) {
            return res.status(404).json({ msg: 'Contract hash not found in ledger. Verification failed.' });
        }

        res.json({
            msg: 'Contract Verified Successfully',
            isValid: true,
            blockDetails: block
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getContracts = async (req, res) => {
    try {
        const db = readDb();
        const contracts = db.contracts
            .filter(c => c.farmer === req.user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
        res.json(contracts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};