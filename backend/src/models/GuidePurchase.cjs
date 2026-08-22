const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const GuidePurchase = sequelize.define('GuidePurchase', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    guide_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'guides',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    download_token: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    downloaded_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    download_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'guide_purchases',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = GuidePurchase;
