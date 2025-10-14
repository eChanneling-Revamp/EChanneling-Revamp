const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Get admin credentials from command line arguments or use defaults
        const adminEmail = process.argv[2] || 'admin@echanneling.com';
        const adminPassword = process.argv[3] || 'admin123';
        const adminName = process.argv[4] || 'System Administrator';

        console.log('🔧 Creating admin user...');
        console.log('📧 Email:', adminEmail);
        console.log('👤 Name:', adminName);

        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('❌ Admin user already exists with email:', adminEmail);

            // Offer to update password
            if (process.argv[5] === '--update-password') {
                const hashedPassword = await bcrypt.hash(adminPassword, 12);

                await prisma.user.update({
                    where: { email: adminEmail },
                    data: {
                        password: hashedPassword,
                        role: 'ADMIN', // Ensure role is admin
                        status: 'ACTIVE' // Ensure status is active
                    }
                });

                console.log('✅ Admin password updated successfully!');
                console.log('🔑 New password:', adminPassword);
            }
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE',
                emailVerified: new Date(), // Mark email as verified
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        console.log('👤 Role:', admin.role);
        console.log('🆔 User ID:', admin.id);
        console.log('\n🚨 IMPORTANT: Please change the default password after first login!');
        console.log('\n📝 Usage examples:');
        console.log('node create-admin.js                                    # Use defaults');
        console.log('node create-admin.js admin@example.com mypassword       # Custom email/password');
        console.log('node create-admin.js admin@example.com newpass "John Doe" --update-password # Update existing');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();