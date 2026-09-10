const { sequelize } = require('./src/models');

async function addColumns() {
    try {
        console.log('🔧 Adding missing columns to products table...');

        await sequelize.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);`);
        console.log('✅ original_price column added');

        await sequelize.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percentage INT DEFAULT 0;`);
        console.log('✅ discount_percentage column added');

        await sequelize.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_expiry TIMESTAMP;`);
        console.log('✅ discount_expiry column added');

        await sequelize.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;`);
        console.log('✅ review_count column added');

        console.log('✅ All columns added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding columns:', error.message);
        process.exit(1);
    }
}

addColumns();