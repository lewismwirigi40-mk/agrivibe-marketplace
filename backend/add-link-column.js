// backend/add-link-column.js
const { sequelize } = require('./src/models');

async function addLinkColumn() {
    try {
        console.log('🔧 Adding "link" column to notifications table...');
        
        await sequelize.query(`
            ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link VARCHAR(255);
        `);
        
        console.log('✅ "link" column added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding column:', error.message);
        process.exit(1);
    }
}

addLinkColumn();