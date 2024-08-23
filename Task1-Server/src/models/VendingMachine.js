const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');
const Pizza = require("./Pizza");
const PizzaAvailability = require('./PizzaAvailability');
const Admin = require("./Admin");

class VendingMachine extends Model {}

VendingMachine.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    city: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'vending_machine',
    tableName: 'vending_machine',
    timestamps: false
});

VendingMachine.hasMany(PizzaAvailability, {
    foreignKey: 'machine_id',
});
PizzaAvailability.belongsTo(VendingMachine, {
    foreignKey: 'machine_id',
});

VendingMachine.hasMany(Admin, {
    foreignKey: 'machine_id',
});
Admin.belongsTo(VendingMachine, {
    foreignKey: 'machine_id',
});


module.exports = VendingMachine;
