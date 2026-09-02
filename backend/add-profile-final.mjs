import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sequelize = require('./src/config/database.cjs');

try {
    await sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);');
    console.log('✅ profile_image column added successfully!');
    process.exit(0);
} catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
}