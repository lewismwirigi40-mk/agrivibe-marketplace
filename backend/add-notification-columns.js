const { sequelize } = require('./src/models');

async function addColumns() {
    try {
        console.log('🔧 Adding missing columns to notifications table...');
        
        // Add link column
        await sequelize.query(\
            ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link VARCHAR(255);
        \);
        console.log('✅ "link" column added');
        
        // Add icon column
        await sequelize.query(\
            ALTER TABLE notifications ADD COLUMN IF NOT EXISTS icon VARCHAR(50);
        \);
        console.log('✅ "icon" column added');
        
        // Add color column
        await sequelize.query(\
            ALTER TABLE notifications ADD COLUMN IF NOT EXISTS color VARCHAR(20);
        \);
        console.log('✅ "color" column added');
        
        console.log('✅ All columns added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding columns:', error.message);
        process.exit(1);
    }
}

addColumns();