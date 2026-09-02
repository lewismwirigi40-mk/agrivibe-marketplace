// backend/list-users.js
const { User } = require('./src/models');

async function listUsers() {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'phone', 'first_name', 'last_name', 'role'],
            order: [['created_at', 'DESC']]
        });
        
        console.log('📋 All Users:');
        console.log('='.repeat(60));
        
        if (users.length === 0) {
            console.log('No users found');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.email}`);
                console.log(`   Phone: ${user.phone}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Name: ${user.first_name} ${user.last_name}`);
                console.log('-'.repeat(40));
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

listUsers();