const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const agriStackService = require('../services/AgriStackService');
const { readDb, writeDb } = require('../utils/jsonDb');
const crypto = require('crypto');
const dns = require('dns');

// Helper to check domain existence via MX records
const checkEmailDomain = (email) => {
    return new Promise((resolve) => {
        const domain = email.split('@')[1];
        if (!domain) return resolve(false);
        
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

exports.fetchAgriStackData = async (req, res) => {
    try {
        const { aadhaar } = req.body;
        const data = await agriStackService.fetchFarmerID(aadhaar);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: err.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, location, cropDetails, role, agriStackId } = req.body;
        
        // Validate Email Domain existence
        const isValidDomain = await checkEmailDomain(email);
        if (!isValidDomain) {
            return res.status(400).json({ msg: 'Invalid Email: Domain does not exist or cannot receive emails.' });
        }

        const db = readDb();

        let user = db.users.find(u => u.email === email);
        
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            _id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            location: location || {},
            cropDetails: cropDetails || [],
            role: role || 'farmer',
            agriStackId,
            trustScore: 500,
            creditBadge: 'Bronze',
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        writeDb(db);

        const payload = { user: { id: newUser._id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = readDb();
        const user = db.users.find(u => u.email === email);

        if (!user) return res.status(400).json({ msg: 'Invalid Email' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Password' });

        const payload = { user: { id: user._id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUser = async (req, res) => {
    try {
        const db = readDb();
        // req.user is set by auth middleware
        const user = db.users.find(u => u._id === req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const db = readDb();
        const user = db.users.find(u => u.email === email);

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (user) {
            console.log(`[Mock Email Service] Password reset link sent to ${email}`);
        }
        
        // Always return success to prevent email enumeration
        res.json({ msg: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};