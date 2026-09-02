import pkg from './src/config/database.cjs';
const { sequelize } = pkg;

try {
    await sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);');
    console.log('✅ profile_image column added successfully!');
    process.exit(0);
} catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
}