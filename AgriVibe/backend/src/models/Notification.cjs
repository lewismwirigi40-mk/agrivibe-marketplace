const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('order', 'payment', 'delivery', 'system', 'promotion', 'message'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    channel: {
        type: DataTypes.ENUM('in_app', 'email', 'sms', 'push'),
        defaultValue: 'in_app'
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    sent_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Notification;