// backend/src/models/UnansweredQuestion.cjs
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

console.log('🔥 UNANSWERED QUESTION MODEL LOADED');

const UnansweredQuestion = sequelize.define('UnansweredQuestion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Question cannot be empty'
            }
        }
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'answered', 'rejected']]
        }
    },
    answered_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // ✅ ADD THESE TWO FIELDS TO MATCH YOUR DATABASE
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'unanswered_questions',
    timestamps: true,  // This tells Sequelize to manage timestamps
    underscored: true,
    createdAt: 'created_at',  // ✅ Map Sequelize's createdAt to your column name
    updatedAt: 'updated_at'   // ✅ Map Sequelize's updatedAt to your column name
});

module.exports = UnansweredQuestion;