// backend/delete-users-batch.js
const { User } = require('./src/models');
const { Op } = require('sequelize');

async function deleteUsers() {
    try {
        // Delete all users with these emails
        const emails = [
            'mk001theguru@gmail.com',
            // Add more emails here if needed
        ];
        
        const result = await User.destroy({
            where: {
                email: {
                    [Op.in]: emails
                }
            }
        });
        
        console.log(`✅ Deleted ${result} users`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

deleteUsers();