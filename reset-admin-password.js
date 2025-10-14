const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
    try {
        const email = process.argv[2] || 'admin@echanneling.com';
        const newPassword = process.argv[3] || 'admin123';

        console.log('🔧 Resetting admin password...');
        console.log('📧 Email:', email);
        console.log('🔑 New Password:', newPassword);

        // Find the admin user
        const admin = await prisma.user.findUnique({
            where: { email }
        });

        if (!admin) {
            console.log('❌ Admin user not found with email:', email);
            return;
        }

        if (admin.role !== 'ADMIN') {
            console.log('❌ User found but is not an admin. Role:', admin.role);
            return;
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the password using findUniqueOrThrow to avoid transactions
        const updatedAdmin = await prisma.user.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                status: 'ACTIVE' // Ensure status is active
            }
        });

        console.log('✅ Admin password updated successfully!');
        console.log('🆔 Admin ID:', updatedAdmin.id);
        console.log('📧 Email:', updatedAdmin.email);
        console.log('👤 Name:', updatedAdmin.name);
        console.log('📊 Status:', updatedAdmin.status);
        console.log('\n🔐 Login Credentials:');
        console.log('Email:', email);
        console.log('Password:', newPassword);
        console.log('\n🌐 You can now login at: http://localhost:3000/login');

    } catch (error) {
        console.error('❌ Error resetting admin password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
