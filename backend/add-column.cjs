// backend/add-column.js
const sequelize = require('./src/config/database.cjs');

async function addColumn() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected!');
        
        await sequelize.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='unanswered_questions' AND column_name='category') 
                THEN 
                    ALTER TABLE "unanswered_questions" ADD COLUMN "category" VARCHAR(50) DEFAULT 'general';
                END IF;
            END $$;
        `);
        console.log('✅ Category column added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addColumn();