const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listAdmins() {
    try {
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                emailVerified: true,
            }
        });

        if (admins.length === 0) {
            console.log('❌ No admin users found');
            return;
        }

        console.log('👑 Admin Users:');
        console.log('================');
        admins.forEach((admin, index) => {
            console.log(`\n${index + 1}. ${admin.name || 'N/A'}`);
            console.log(`   📧 Email: ${admin.email}`);
            console.log(`   🆔 ID: ${admin.id}`);
            console.log(`   📊 Status: ${admin.status}`);
            console.log(`   ✅ Verified: ${admin.emailVerified ? 'Yes' : 'No'}`);
            console.log(`   📅 Created: ${admin.createdAt.toISOString()}`);
        });

        console.log(`\n📊 Total admin users: ${admins.length}`);

    } catch (error) {
        console.error('❌ Error listing admin users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listAdmins();
