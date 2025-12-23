const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ledgerPath = path.join(__dirname, '../blockchain/ledger.json');

// Ensure ledger exists
if (!fs.existsSync(ledgerPath)) {
    // Create directory if it doesn't exist
    const dir = path.dirname(ledgerPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ledgerPath, JSON.stringify([]));
}

const calculateHash = (data) => {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

exports.addToLedger = (contract) => {
    let ledger = [];
    try {
        const data = fs.readFileSync(ledgerPath);
        ledger = JSON.parse(data);
    } catch (err) {
        console.error("Error reading ledger:", err);
        ledger = [];
    }
    
    const previousBlock = ledger.length > 0 ? ledger[ledger.length - 1] : null;
    const previousHash = previousBlock ? previousBlock.hash : '0';
    
    // We only hash the critical immutable data
    const blockData = {
        contractId: contract._id,
        farmer: contract.farmer,
        counterparty: contract.counterparty,
        crop: contract.crop,
        quantity: contract.quantity,
        price: contract.price,
        maturityDate: contract.maturityDate
    };

    const timestamp = new Date().toISOString();
    // Create a hash based on data, previous hash, and timestamp
    const hash = calculateHash({ ...blockData, previousHash, timestamp });

    const newBlock = {
        index: ledger.length + 1,
        timestamp,
        data: blockData,
        previousHash,
        hash
    };

    ledger.push(newBlock);
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
    
    return hash;
};

exports.verifyInLedger = (hash) => {
    try {
        const data = fs.readFileSync(ledgerPath);
        const ledger = JSON.parse(data);
        return ledger.find(block => block.hash === hash);
    } catch (err) {
        console.error("Error reading ledger for verification:", err);
        return null;
    }
};