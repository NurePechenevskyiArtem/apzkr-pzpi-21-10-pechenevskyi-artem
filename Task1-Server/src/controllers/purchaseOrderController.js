const PurchaseOrder = require('../models/PurchaseOrder');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const PizzaAvailability = require('../models/PizzaAvailability');
const Pizza = require('../models/Pizza');
const Admin = require('../models/Admin');
const Supplier = require('../models/Supplier');
const VendingMachine = require("../models/VendingMachine");

exports.createPurchaseOrder = async (req, res) => {
    try {
        const { admin_id, supplier_id, machine_id } = req.body;

        const excelFileName = await generateExcelFile(admin_id, supplier_id, machine_id);

        const newOrder = await PurchaseOrder.create({
            admin_id,
            supplier_id,
            excel_name: excelFileName,
        });

        res.status(201).json({
            message: 'Purchase order created successfully',
            order: newOrder,
        });
    } catch (error) {
        console.error('Error creating purchase order:', error);
        res.status(500).json({ message: 'Failed to create purchase order', error: error.message });
    }
};



async function generateExcelFile(admin_id, supplier_id, machine_id) {
    const excelFileName = `order_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, '../excel', excelFileName);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Order');

    worksheet.columns = [
        { header: 'Pizza Name', key: 'pizza_name', width: 30 },
        { header: 'Count', key: 'count', width: 10 },
    ];

    const pizzasInMachine = await PizzaAvailability.findAll({
        where: { machine_id: machine_id },
        include: [Pizza],
    });

    pizzasInMachine.forEach(pizzaAvailability => {
        let count = 0;
        const currentCount = pizzaAvailability.count;

        if (currentCount === 0) {
            count = 10;
        } else if (currentCount < 6) {
            count = 10 - currentCount;
        } else {
            count = 0;
        }

        if (count > 0) {
            worksheet.addRow({
                pizza_name: pizzaAvailability.pizza.name,
                count: count,
            });
        }
    });

    await workbook.xlsx.writeFile(filePath);

    return excelFileName;
}

exports.getOrdersBySupplierId = async (req, res) => {
    try {
        const { supplier_id } = req.params;

        const supplier = await Supplier.findByPk(supplier_id);

        const orders = await PurchaseOrder.findAll({
            where: { supplier_id },
            include: [
                {
                    model: Admin,
                    attributes: ['name'],
                    include: {
                        model: VendingMachine,
                        attributes: ['city', 'address']
                    }
                }
            ],
            order: [['status', 'ASC'], ['date', 'DESC']]
        });

        const result = orders.map(order => ({
            id: order.id,
            admin_name: order.admin.name,
            supplier_name: supplier.name,
            city: order.admin.vending_machine ? order.admin.vending_machine.city : 'Unknown',
            address: order.admin.vending_machine ? order.admin.vending_machine.address : 'Unknown',
            date: order.date,
            excel_name: order.excel_name,
            status: order.status
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching orders by supplier_id:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

exports.getOrdersByAdminId = async (req, res) => {
    try {
        const { admin_id } = req.params;

        const orders = await PurchaseOrder.findAll({
            where: { admin_id },
            include: [
                {
                    model: Admin,
                    attributes: ['name'],
                    include: {
                        model: VendingMachine,
                        attributes: ['city', 'address']
                    }
                }
            ],
            order: [['status', 'ASC'], ['date', 'DESC']]
        });

        const result = await Promise.all(orders.map(async (order) => {
            const supplier = await Supplier.findOne({
                where: { id: order.supplier_id },
                attributes: ['name']
            });

            return {
                id: order.id,
                admin_name: order.admin.name,
                supplier_name: supplier ? supplier.name : 'Unknown',
                city: order.admin.vending_machine ? order.admin.vending_machine.city : 'Unknown',
                address: order.admin.vending_machine ? order.admin.vending_machine.address : 'Unknown',
                date: order.date,
                excel_name: order.excel_name,
                status: order.status
            };
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching orders by admin_id:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};




exports.updateOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.params;

        const order = await PurchaseOrder.findByPk(order_id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status) {
            return res.status(400).json({ message: 'Order status is not pending' });
        }

        order.status = 1;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};