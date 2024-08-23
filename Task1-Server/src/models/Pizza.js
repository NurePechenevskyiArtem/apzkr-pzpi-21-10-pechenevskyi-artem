const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');
const VendingMachine = require("./VendingMachine");
const PizzaAvailability = require('./PizzaAvailability')

class Pizza extends Model {}

Pizza.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.INTEGER,
    },
    photo: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'pizza',
    tableName: 'pizza',
    timestamps: false
});

Pizza.hasMany(PizzaAvailability, {
    foreignKey: 'pizza_id',
});
PizzaAvailability.belongsTo(Pizza, {
    foreignKey: 'pizza_id',
});

module.exports = Pizza;
