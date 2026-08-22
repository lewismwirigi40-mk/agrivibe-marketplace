const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Guide = sequelize.define('Guide', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    cover_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    file_url: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    file_size: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    downloads: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: 'guides',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Guide;
