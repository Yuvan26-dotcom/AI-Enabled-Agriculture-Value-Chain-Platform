const express = require('express');
// const mongoose = require('mongoose'); // Removed for JSON DB
const cors = require('cors');
const dotenv = require('dotenv');
const { loadFromFirebase } = require('./utils/jsonDb');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/biometrix', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB Connected'))
// .catch(err => console.log('MongoDB Connection Failed (Running in Offline Mode)'));
console.log('Running with Local JSON Database (No MongoDB required)');

// Load data from Firebase on start
// loadFromFirebase().then(() => console.log('Initial data sync from Firebase completed'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contracts', require('./routes/contractRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/trace', require('./routes/traceRoutes'));
app.use('/api/advisory', require('./routes/advisoryRoutes'));
app.use('/api/credit', require('./routes/creditRoutes'));
app.use('/api/logistics', require('./routes/logisticsRoutes'));
app.use('/api/soil', require('./routes/soilRoutes'));
app.use('/api/pest-reports', require('./routes/pestRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/geo', require('./routes/geoRoutes'));
app.use('/api/soil', require('./routes/soilRoutes'));
app.use('/api/produce', require('./routes/produceRoutes'));
app.use('/api', require('./routes/crops'));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with PID ${process.pid}`);
    setInterval(() => console.log('Heartbeat'), 5000);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error: ${err}`);
    // server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.log(`Logged Error: ${err}`);
});

process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});

process.on('SIGTERM', () => {
    console.log('Process received SIGTERM');
    process.exit(0);
});
