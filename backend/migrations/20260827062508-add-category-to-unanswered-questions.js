'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Add the column using raw SQL (bypasses ENUM issues)
      await queryInterface.sequelize.query(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_name='unanswered_questions' AND column_name='category') 
          THEN 
            ALTER TABLE "unanswered_questions" ADD COLUMN "category" VARCHAR(50) DEFAULT 'general';
          END IF;
        END $$;
      `);
      console.log('✅ Category column added successfully');
    } catch (error) {
      console.error('❌ Migration error:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(`
        ALTER TABLE "unanswered_questions" DROP COLUMN IF EXISTS "category";
      `);
      console.log('✅ Category column removed successfully');
    } catch (error) {
      console.error('❌ Rollback error:', error.message);
      throw error;
    }
  }
};