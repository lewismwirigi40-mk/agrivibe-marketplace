import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sequelize = require('./src/config/database.cjs');

async function addColumns() {
    try {
        console.log('🔧 Adding missing columns...');

        await sequelize.query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS delivery_code VARCHAR(6);');
        console.log('✅ delivery_code');

        await sequelize.query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS code_verified_at TIMESTAMP;');
        console.log('✅ code_verified_at');

        await sequelize.query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS code_attempts INTEGER DEFAULT 0;');
        console.log('✅ code_attempts');

        await sequelize.query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS escrow_amount DECIMAL(10,2);');
        console.log('✅ escrow_amount');

        await sequelize.query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS escrow_released BOOLEAN DEFAULT false;');
        console.log('✅ escrow_released');

        await sequelize.query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS escrow_released_at TIMESTAMP;');
        console.log('✅ escrow_released_at');

        console.log('✅ ALL DONE!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addColumns();