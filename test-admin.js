// Test admin login functionality
const testAdminLogin = async () => {
    try {
        console.log('🔧 Testing Admin Login...');
        console.log('📧 Email: admin@echanneling.com');
        console.log('🔑 Password: admin123');
        console.log('🌐 Login URL: http://localhost:3000/login');
        console.log('📋 Admin Dashboard: http://localhost:3000/admin/dashboard');
        console.log('🔗 Admin API: http://localhost:3000/api/admin');

        console.log('\n✅ Admin Setup Complete!');
        console.log('\n📝 Next Steps:');
        console.log('1. Open http://localhost:3000/login in your browser');
        console.log('2. Login with the credentials above');
        console.log('3. You should be redirected to the dashboard');
        console.log('4. Access admin routes at /admin/dashboard and /admin/users');
        console.log('5. Test admin API at /api/admin');

        console.log('\n🛡️ Security Notes:');
        console.log('- Change the default password after first login');
        console.log('- Admin role is checked in API routes');
        console.log('- Session management is handled by NextAuth');

        console.log('\n🔧 Available Scripts:');
        console.log('- npm run create-admin          # Create new admin');
        console.log('- node reset-admin-mongo.js     # Reset admin password');
        console.log('- node list-admins.js          # List all admin users');

    } catch (error) {
        console.error('❌ Error:', error);
    }
};

testAdminLogin();
