const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');
const PurchaseOrder = require("./PurchaseOrder")

class Supplier extends Model {}

Supplier.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    company_name: {
        type: DataTypes.STRING,
    },
    company_address: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize,
    modelName: 'supplier',
    tableName: 'supplier',
    timestamps: false
});

// Supplier.hasMany(PurchaseOrder, {
//     foreignKey: 'supplier_id',
// });
// PurchaseOrder.belongsTo(Supplier, {
//     foreignKey: 'supplier_id',
// });

module.exports = Supplier;