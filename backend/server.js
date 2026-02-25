const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cmsRoutes = require('./routes/cms');
const reportRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with retry and fallback logic
const connectDB = async () => {
    // Build connection options
    const mongoOptions = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4
    };

    // In development mode, bypass TLS validation if enabled
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_TLS === 'true') {
        console.log('⚠️  Development mode: TLS validation bypassed');
        mongoOptions.tls = true;
        mongoOptions.tlsAllowInvalidCertificates = true;
        mongoOptions.tlsAllowInvalidHostnames = true;
    }

    let connected = false;
    let connectionUri = process.env.MONGODB_URI;
    let connectionName = 'MongoDB Atlas';

    // Try MongoDB Atlas first
    try {
        console.log('🔄 Connecting to MongoDB Atlas...');
        await mongoose.connect(connectionUri, mongoOptions);
        connected = true;
        console.log('✅ MongoDB Atlas connected successfully');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
    } catch (atlasError) {
        console.error('❌ MongoDB Atlas connection failed:', atlasError.message);

        // Try local MongoDB as fallback
        if (process.env.MONGODB_LOCAL_URI) {
            try {
                console.log('🔄 Attempting local MongoDB fallback...');
                connectionUri = process.env.MONGODB_LOCAL_URI;
                connectionName = 'Local MongoDB';
                await mongoose.connect(connectionUri, {
                    serverSelectionTimeoutMS: 5000,
                    family: 4
                });
                connected = true;
                console.log('✅ Local MongoDB connected successfully');
                console.log('📊 Database:', mongoose.connection.db.databaseName);
                console.log('⚠️  Using local MongoDB - data will not sync with Atlas');
            } catch (localError) {
                console.error('❌ Local MongoDB connection also failed:', localError.message);
            }
        }

        if (!connected) {
            console.error('\n❌ All MongoDB connection attempts failed!');
            console.error('💡 Solutions:');
            console.error('   1. Whitelist your IP in MongoDB Atlas (Network Access)');
            console.error('   2. Install MongoDB locally: https://www.mongodb.com/try/download/community');
            console.error('   3. Check your .env file configuration');
            console.error('   4. Verify network/firewall settings\n');
        }
    }

    return connected;
};

// Connect to MongoDB
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected - attempting to reconnect...');
    setTimeout(connectDB, 5000); // Retry after 5 seconds
});

mongoose.connection.on('connected', () => {
    console.log('🔄 MongoDB connection established');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'CMS API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            cms: '/api/cms',
            reports: '/api/reports',
            settings: '/api/settings'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
});
