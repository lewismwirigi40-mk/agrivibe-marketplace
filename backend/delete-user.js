// backend/delete-user.js
const { User } = require('./src/models');

async function deleteUser() {
    try {
        const email = 'mk001theguru@gmail.com';
        
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            console.log(`❌ User with email ${email} not found`);
            process.exit(0);
        }
        
        console.log(`✅ Found user: ${user.email} (${user.first_name} ${user.last_name})`);
        console.log(`📊 Role: ${user.role}`);
        console.log(`📱 Phone: ${user.phone}`);
        
        // Delete the user
        await user.destroy();
        
        console.log(`✅ User ${email} deleted successfully!`);
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

deleteUser();