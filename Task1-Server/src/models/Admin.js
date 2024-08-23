const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');
const VendingMachine = require("./VendingMachine");
const PizzaAvailability = require("./PizzaAvailability");
const PurchaseOrder = require("./PurchaseOrder")

class Admin extends Model {}

Admin.init({
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
    phone_number: {
        type: DataTypes.STRING,
    },
    machine_id: {
        type: DataTypes.INTEGER,
        references: {
            model: VendingMachine,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'admin',
    tableName: 'admin',
    timestamps: false
});

Admin.hasMany(PurchaseOrder, {
    foreignKey: 'admin_id',
});
PurchaseOrder.belongsTo(Admin, {
    foreignKey: 'admin_id',
});

module.exports = Admin;