const fs = require('fs');
const path = require('path');
const { db: firestore } = require('../config/firebase');

const dbPath = path.join(__dirname, '../data/db.json');

// Helper to read DB
const readDb = () => {
    const initialData = { users: [], bids: [], shipments: [], contracts: [] };
    
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        if (!data) return initialData;
        const parsed = JSON.parse(data);
        // Ensure all keys exist
        return { ...initialData, ...parsed };
    } catch (err) {
        console.error("Error reading DB:", err);
        return initialData;
    }
};

// Helper to write DB
const writeDb = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    
    // Sync to Firebase (Fire-and-forget)
    syncToFirebase(data).catch(err => console.error("Firebase Sync Error:", err));
};

const syncToFirebase = async (data) => {
    try {
        // We store the entire DB state in a single document for simplicity in this hybrid approach
        // Or we can split by collection. Let's split by top-level keys.
        const batch = firestore.batch();
        
        // Sync Users
        if (data.users && Array.isArray(data.users)) {
            // This is inefficient for large datasets but works for small scale
            // For a real app, we would only update changed documents
            // Here we just update a 'backup' document or similar
             const backupRef = firestore.collection('backups').doc('current_state');
             batch.set(backupRef, data);
        }
        
        await batch.commit();
        console.log("Synced state to Firebase");
    } catch (error) {
        console.error("Failed to sync to Firebase:", error);
    }
};

// Function to load data from Firebase on startup
const loadFromFirebase = async () => {
    try {
        const doc = await firestore.collection('backups').doc('current_state').get();
        if (doc.exists) {
            const data = doc.data();
            console.log("Loaded data from Firebase");
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
            return data;
        }
    } catch (error) {
        console.error("Failed to load from Firebase:", error);
    }
    return null;
};

module.exports = { readDb, writeDb, loadFromFirebase };
