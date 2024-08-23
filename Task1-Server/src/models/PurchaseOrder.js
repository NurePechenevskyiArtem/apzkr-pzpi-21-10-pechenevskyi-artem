const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');
const Pizza = require("./Pizza");
const VendingMachine = require("./VendingMachine");
const Admin = require("./Admin")
const Supplier = require("./Supplier")

class PurchaseOrder extends Model {}

PurchaseOrder.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATE
    },
    admin_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Admin,
            key: 'id',
        },
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Supplier,
            key: 'id',
        },
    },
    excel_name: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.BOOLEAN
    }
}, {
    sequelize,
    modelName: 'purchase_order',
    tableName: 'purchase_order',
    timestamps: false
});

module.exports = PurchaseOrder;