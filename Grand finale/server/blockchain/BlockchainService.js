const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data))
            .digest('hex');
    }
}

class BlockchainService {
    constructor() {
        this.ledgerPath = path.join(__dirname, 'trace_ledger.json');
        this.chain = [this.createGenesisBlock()];
        this.loadChain();
    }

    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), "Genesis Block", "0");
    }

    loadChain() {
        // Ensure directory exists
        const dir = path.dirname(this.ledgerPath);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        if (fs.existsSync(this.ledgerPath)) {
            try {
                const data = fs.readFileSync(this.ledgerPath);
                const loadedChain = JSON.parse(data);
                if (loadedChain.length > 0) {
                    // Reconstruct Block objects
                    this.chain = loadedChain.map(blk => {
                        const block = new Block(blk.index, blk.timestamp, blk.data, blk.previousHash);
                        block.hash = blk.hash; 
                        return block;
                    });
                }
            } catch (err) {
                console.error("Error loading ledger, starting fresh:", err);
                this.saveChain();
            }
        } else {
            this.saveChain();
        }
    }

    saveChain() {
        fs.writeFileSync(this.ledgerPath, JSON.stringify(this.chain, null, 2));
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        // data: { batchId, farmerId, harvestDate, qualityGrade, processorId, currentStatus }
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(
            previousBlock.index + 1,
            new Date().toISOString(),
            data,
            previousBlock.hash
        );
        this.chain.push(newBlock);
        this.saveChain();
        return newBlock;
    }

    verifyChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Check if the stored hash matches the calculated hash (Data Tampering Check)
            const recalculatedHash = crypto.createHash('sha256')
                .update(currentBlock.index + currentBlock.previousHash + currentBlock.timestamp + JSON.stringify(currentBlock.data))
                .digest('hex');

            if (currentBlock.hash !== recalculatedHash) {
                console.error(`Block ${currentBlock.index} invalid: Hash mismatch`);
                return false;
            }

            // 2. Check if the previousHash matches the hash of the previous block (Linkage Check)
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.error(`Block ${currentBlock.index} invalid: Previous hash mismatch`);
                return false;
            }
        }
        return true;
    }

    getTraceHistory(batchId) {
        // Filter blocks that contain this batchId in their data
        return this.chain.filter(block => block.data && block.data.batchId === batchId);
    }
}

module.exports = new BlockchainService();