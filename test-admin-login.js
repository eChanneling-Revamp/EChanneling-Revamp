/**
 * Test admin login functionality
 */

async function testAdminLogin() {
    const loginUrl = 'http://localhost:3000/api/auth/callback/credentials';
    const adminApiUrl = 'http://localhost:3000/api/admin';

    console.log('🧪 Testing Admin Login...\n');

    try {
        // Test 1: Try to access admin API without authentication
        console.log('1. Testing admin API without authentication...');
        const unauthResponse = await fetch(adminApiUrl);
        console.log(`   Status: ${unauthResponse.status}`);
        console.log(`   Expected: 401 (Unauthorized)`);
        console.log(`   ✅ Test passed: ${unauthResponse.status === 401 ? 'Yes' : 'No'}\n`);

        // Test 2: Admin credentials
        console.log('2. Admin Login Credentials:');
        console.log('   📧 Email: admin@echanneling.com');
        console.log('   🔑 Password: admin123');
        console.log('   🌐 Login URL: http://localhost:3000/login');
        console.log('   🔗 Admin API: http://localhost:3000/api/admin\n');

        // Test 3: Check if admin user exists in database
        console.log('3. Verifying admin user in database...');
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        const admin = await prisma.user.findUnique({
            where: { email: 'admin@echanneling.com' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                password: true,
            }
        });

        if (admin) {
            console.log('   ✅ Admin user found in database');
            console.log(`   🆔 ID: ${admin.id}`);
            console.log(`   👤 Name: ${admin.name}`);
            console.log(`   📧 Email: ${admin.email}`);
            console.log(`   🎭 Role: ${admin.role}`);
            console.log(`   📊 Status: ${admin.status}`);
            console.log(`   🔐 Password Hash: ${admin.password ? 'Set' : 'Not Set'}`);
        } else {
            console.log('   ❌ Admin user not found in database');
        }

        await prisma.$disconnect();

        console.log('\n📋 Manual Testing Steps:');
        console.log('1. Open browser and go to: http://localhost:3000/login');
        console.log('2. Enter email: admin@echanneling.com');
        console.log('3. Enter password: admin123');
        console.log('4. Click "Sign In"');
        console.log('5. You should be redirected to: http://localhost:3000/dashboard');
        console.log('6. Test admin API: http://localhost:3000/api/admin');
        console.log('\n🎯 Expected Results:');
        console.log('- Login should succeed');
        console.log('- Dashboard should load');
        console.log('- Admin API should return admin information');
        console.log('- No Kafka errors should appear in console');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testAdminLogin();
