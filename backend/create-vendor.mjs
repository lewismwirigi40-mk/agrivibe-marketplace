import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sequelize = require('./src/config/database.cjs');

try {
    await sequelize.query(\
        INSERT INTO vendors (id, user_id, business_name, business_description, is_approved, is_active, status, created_at, updated_at) 
        VALUES (gen_random_uuid(), 'ce94da66-ebaf-449f-90a0-19f7fea55904', 'Test Vendor', 'Test vendor for analytics', true, true, 'approved', NOW(), NOW())
        ON CONFLICT (user_id) DO UPDATE SET 
            business_name = 'Test Vendor', 
            is_approved = true, 
            is_active = true, 
            status = 'approved';
    \);
    console.log('✅ Vendor created/updated!');
    process.exit(0);
} catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
}