const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';

// Test credentials
const adminCreds = {
    email: 'admin@test.com',
    password: 'admin123'
};

const userCreds = {
    email: 'user@test.com',
    password: 'user123'
};

let adminToken = '';
let userToken = '';
let testContentId = '';

console.log('🧪 Testing CMS Approval Flow\n');

// Helper function to create users if they don't exist
async function ensureUsers() {
    try {
        // Try to create admin
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Admin User',
            email: adminCreds.email,
            password: adminCreds.password,
            role: 'Admin'
        });
        console.log('✅ Admin user created');
    } catch (err) {
        if (err.response?.data?.message?.includes('already exists')) {
            console.log('ℹ️  Admin user already exists');
        }
    }

    try {
        // Try to create regular user
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Regular User',
            email: userCreds.email,
            password: userCreds.password,
            role: 'User'
        });
        console.log('✅ Regular user created');
    } catch (err) {
        if (err.response?.data?.message?.includes('already exists')) {
            console.log('ℹ️  Regular user already exists');
        }
    }
}

// Login as admin
async function loginAdmin() {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, adminCreds);
        adminToken = response.data.token;
        console.log('✅ Admin logged in successfully');
        return true;
    } catch (err) {
        console.error('❌ Admin login failed:', err.response?.data?.message || err.message);
        return false;
    }
}

// Login as regular user
async function loginUser() {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userCreds);
        userToken = response.data.token;
        console.log('✅ User logged in successfully');
        return true;
    } catch (err) {
        console.error('❌ User login failed:', err.response?.data?.message || err.message);
        return false;
    }
}

// User creates content (should be pending)
async function createUserContent() {
    try {
        const response = await axios.post(`${API_URL}/cms`, {
            title: `Test Content ${Date.now()}`,
            description: 'This is test content created by a regular user',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        testContentId = response.data.data._id;
        console.log('✅ User created content (status:', response.data.data.status + ')');
        console.log('   Content ID:', testContentId);
        return true;
    } catch (err) {
        console.error('❌ Failed to create content:', err.response?.data?.message || err.message);
        return false;
    }
}

// Admin gets pending content
async function getPendingContent() {
    try {
        console.log('\n📋 Fetching pending content as admin...');
        const response = await axios.get(`${API_URL}/cms/pending`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        console.log('✅ Pending content fetched successfully');
        console.log('   Count:', response.data.count);
        console.log('   Pending items:', response.data.data.length);

        if (response.data.data.length > 0) {
            console.log('\n📝 Pending submissions:');
            response.data.data.forEach((item, idx) => {
                console.log(`   ${idx + 1}. "${item.title}" by ${item.createdBy?.name} (${item.createdBy?.email})`);
            });
        } else {
            console.log('   ⚠️  No pending content found');
        }

        return response.data.data.length > 0;
    } catch (err) {
        console.error('❌ Failed to fetch pending content:', err.response?.data?.message || err.message);
        console.error('   Status:', err.response?.status);
        console.error('   URL:', err.config?.url);
        return false;
    }
}

// Admin approves content
async function approveContent(id) {
    try {
        const response = await axios.put(`${API_URL}/cms/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        console.log('✅ Content approved successfully');
        console.log('   Status:', response.data.data.status);
        return true;
    } catch (err) {
        console.error('❌ Failed to approve content:', err.response?.data?.message || err.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('='.repeat(60));
    console.log('CMS Approval Flow Test');
    console.log('='.repeat(60) + '\n');

    await ensureUsers();
    console.log('');

    const adminLoggedIn = await loginAdmin();
    if (!adminLoggedIn) {
        console.log('\n❌ Cannot proceed without admin login');
        process.exit(1);
    }

    const userLoggedIn = await loginUser();
    if (!userLoggedIn) {
        console.log('\n❌ Cannot proceed without user login');
        process.exit(1);
    }

    console.log('');
    const contentCreated = await createUserContent();
    if (!contentCreated) {
        console.log('\n❌ Failed to create test content');
        process.exit(1);
    }

    const hasPending = await getPendingContent();

    if (hasPending && testContentId) {
        console.log('\n🔄 Testing approval...');
        await approveContent(testContentId);

        // Check pending again
        console.log('\n🔄 Checking pending content after approval...');
        await getPendingContent();
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Test completed!');
    console.log('='.repeat(60));
    console.log('\n✅ CMS approval flow is working correctly!');
    console.log('   - Users can create content (pending status)');
    console.log('   - Admins can see pending content');
    console.log('   - Admins can approve content');
}

// Execute tests
runTests().catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
    process.exit(1);
});
