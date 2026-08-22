const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Campus = sequelize.define('Campus', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    institution_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'University, College, Polytechnic, or School name'
    },
    institution_type: {
        type: DataTypes.ENUM('university', 'college', 'polytechnic', 'institute', 'school', 'other'),
        defaultValue: 'university'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(100),
        defaultValue: 'Kenya'
    },
    student_population: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    cover_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    contact_email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    }
}, {
    tableName: 'campuses',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Campus;