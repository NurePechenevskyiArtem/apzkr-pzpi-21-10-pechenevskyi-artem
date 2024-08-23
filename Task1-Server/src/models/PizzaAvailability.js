const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');
const Pizza = require("./Pizza");
const VendingMachine = require("./VendingMachine");

class PizzaAvailability extends Model {}

PizzaAvailability.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pizza_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Pizza,
            key: 'id',
        },
    },
    machine_id: {
        type: DataTypes.INTEGER,
        references: {
            model: VendingMachine,
            key: 'id',
        },
    },
    count: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize,
    modelName: 'pizza_availability',
    tableName: 'pizza_availability',
    timestamps: false
});

module.exports = PizzaAvailability;