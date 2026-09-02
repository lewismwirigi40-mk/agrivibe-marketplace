import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { sequelize } = require('./src/config/database.cjs');

try {
    await sequelize.query(\ALTER TABLE vendors ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';\);
    await sequelize.query(\ALTER TABLE vendors ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;\);
    await sequelize.query(\ALTER TABLE vendors ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;\);
    await sequelize.query(\UPDATE vendors SET status = 'approved' WHERE is_approved = true;\);
    await sequelize.query(\UPDATE vendors SET status = 'pending' WHERE is_approved = false;\);
    console.log('✅ All vendor columns added successfully!');
    process.exit(0);
} catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
}