const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('customer', 'vendor', 'driver', 'admin', 'farmer'),
        defaultValue: 'customer'
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        comment: 'User\'s current latitude'
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        comment: 'User\'s current longitude'
    },
    location_address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Formatted address from reverse geocoding'
    },
    location_updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last time location was updated'
    },
    location_sharing_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether user allows location sharing'
    }
}, {
    tableName: 'users',
    timestamps: true
    // ✅ REMOVED: hooks block - Controller handles hashing
});

// ✅ Instance method to check password (KEEP THIS!)
User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;