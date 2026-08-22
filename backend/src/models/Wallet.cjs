const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Wallet = sequelize.define('Wallet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total_earned: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total_withdrawn: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    pending_withdrawal: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'KES'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'wallets',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Wallet;