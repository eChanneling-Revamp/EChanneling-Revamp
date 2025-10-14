const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function resetAdminPasswordMongo() {
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/echanneling');
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    const email = process.argv[2] || 'admin@echanneling.com';
    const newPassword = process.argv[3] || 'admin123';
    
    console.log('🔧 Updating admin password...');
    console.log('📧 Email:', email);
    
    // Find admin user
    const admin = await users.findOne({ email, role: 'ADMIN' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password directly
    const result = await users.updateOne(
      { _id: admin._id },
      { 
        $set: { 
          password: hashedPassword,
          status: 'ACTIVE',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 1) {
      console.log('✅ Admin password updated successfully!');
      console.log('\n🔐 Login Credentials:');
      console.log('📧 Email:', email);
      console.log('🔑 Password:', newPassword);
      console.log('\n🌐 Login URL: http://localhost:3000/login');
      console.log('\n⚠️  Please change this password after first login!');
    } else {
      console.log('❌ Failed to update password');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Load environment variables
require('dotenv').config();
resetAdminPasswordMongo();
