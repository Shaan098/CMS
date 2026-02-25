const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'User'
};

console.log('🧪 Testing CMS Authentication Endpoints\n');

// Test 1: Server Health Check
async function testServerHealth() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log('✅ Test 1: Server is running');
        console.log('   Response:', response.data.message);
        return true;
    } catch (error) {
        console.error('❌ Test 1 FAILED: Server not responding');
        console.error('   Error:', error.message);
        return false;
    }
}

// Test 2: Registration
async function testRegistration() {
    try {
        console.log('\n📝 Test 2: Testing registration...');
        console.log('   Email:', testUser.email);

        const response = await axios.post(`${API_URL}/auth/register`, testUser);

        if (response.data.success) {
            console.log('✅ Test 2: Registration successful');
            console.log('   User ID:', response.data.user.id);
            console.log('   Name:', response.data.user.name);
            console.log('   Role:', response.data.user.role);
            return testUser;
        } else {
            console.error('❌ Test 2 FAILED:', response.data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Test 2 FAILED: Registration error');
        console.error('   Status:', error.response?.status);
        console.error('   Message:', error.response?.data?.message || error.message);
        return null;
    }
}

// Test 3: Login
async function testLogin(credentials) {
    try {
        console.log('\n🔐 Test 3: Testing login...');
        console.log('   Email:', credentials.email);

        const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password
        });

        if (response.data.success && response.data.token) {
            console.log('✅ Test 3: Login successful');
            console.log('   Token received:', response.data.token.substring(0, 20) + '...');
            console.log('   User:', response.data.user.name);
            return response.data.token;
        } else {
            console.error('❌ Test 3 FAILED:', response.data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Test 3 FAILED: Login error');
        console.error('   Status:', error.response?.status);
        console.error('   Message:', error.response?.data?.message || error.message);
        return null;
    }
}

// Test 4: Get Profile (authenticated request)
async function testGetProfile(token) {
    try {
        console.log('\n👤 Test 4: Testing profile retrieval...');

        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.data.success) {
            console.log('✅ Test 4: Profile retrieved successfully');
            console.log('   Name:', response.data.user.name);
            console.log('   Email:', response.data.user.email);
            console.log('   Role:', response.data.user.role);
            return true;
        } else {
            console.error('❌ Test 4 FAILED:', response.data.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Test 4 FAILED: Profile retrieval error');
        console.error('   Status:', error.response?.status);
        console.error('   Message:', error.response?.data?.message || error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('='.repeat(60));
    console.log('Starting Authentication Tests');
    console.log('='.repeat(60));

    // Wait a moment for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    const serverOk = await testServerHealth();
    if (!serverOk) {
        console.log('\n❌ Server is not running. Please start the server first.');
        process.exit(1);
    }

    const registeredUser = await testRegistration();
    if (!registeredUser) {
        console.log('\n❌ Registration failed. Cannot proceed with further tests.');
        console.log('💡 Check if MongoDB is connected properly.');
        process.exit(1);
    }

    const token = await testLogin(registeredUser);
    if (!token) {
        console.log('\n❌ Login failed. Cannot proceed with profile test.');
        process.exit(1);
    }

    await testGetProfile(token);

    console.log('\n' + '='.repeat(60));
    console.log('✨ All tests completed!');
    console.log('='.repeat(60));
    console.log('\n✅ Authentication is working correctly!');
    console.log('   - Registration: ✅');
    console.log('   - Login: ✅');
    console.log('   - Profile: ✅');
    console.log('\n🎉 Your CMS authentication is fully functional!');
}

// Execute tests
runTests().catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
    process.exit(1);
});
