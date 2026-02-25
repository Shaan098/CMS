require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB connection...');
console.log('📍 Connection string (sanitized):', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));

const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4 // Force IPv4
};

mongoose.connect(process.env.MONGODB_URI, options)
    .then(() => {
        console.log('✅ MongoDB connection successful!');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
        console.log('📡 Host:', mongoose.connection.host);
        console.log('\n✨ Your authentication should work now!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n❌ MongoDB connection failed!');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('\n💡 Common solutions:');
        console.error('   1. Whitelist your IP in MongoDB Atlas (Network Access)');
        console.error('   2. Check if your username/password are correct');
        console.error('   3. Verify your network allows MongoDB connections (port 27017)');
        console.error('   4. Temporarily disable firewall/antivirus to test');
        console.error('\n🔒 SSL Error detected - likely IP not whitelisted in MongoDB Atlas');
        process.exit(1);
    });
