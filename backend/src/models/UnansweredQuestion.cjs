const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const UnansweredQuestion = sequelize.define('UnansweredQuestion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'answered', 'ignored'),
        defaultValue: 'pending'
    },
    asked_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    answered_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    asked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    answered_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'unanswered_questions',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = UnansweredQuestion;