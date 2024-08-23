const VendingMachine = require('../models/VendingMachine')

exports.getAllVendingMachines = async (req, res) => {
    try {
        const vendingMachines = await VendingMachine.findAll();
        res.status(200).json(vendingMachines);
    } catch (error) {
        console.error('Error getting all vending machines:', error);
        res.status(500).json({ message: 'Failed to get all vending machines', error: error.message });
    }
};

exports.getVendingMachineById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendingMachine = await VendingMachine.findByPk(id);

        if (!vendingMachine) {
            return res.status(404).json({ message: `Vending machine with id ${id} not found` });
        }

        res.status(200).json(vendingMachine);
    } catch (error) {
        console.error('Error getting vending machine by id:', error);
        res.status(500).json({ message: 'Failed to get vending machine by id', error: error.message });
    }
};

exports.createVendingMachine = async (req, res) => {
    try {
        const { city, address } = req.body;

        const newVendingMachine = await VendingMachine.create({
            city,
            address
        });

        res.status(201).json(newVendingMachine);
    } catch (error) {
        console.error('Error creating vending machine:', error);
        res.status(500).json({ message: 'Failed to create vending machine', error: error.message });
    }
};

exports.updateVendingMachineById = async (req, res) => {
    try {
        const { id } = req.params;
        const { city, address } = req.body;

        const vendingMachine = await VendingMachine.findByPk(id);

        if (!vendingMachine) {
            return res.status(404).json({ message: `Vending machine with id ${id} not found` });
        }

        vendingMachine.city = city || vendingMachine.city;
        vendingMachine.address = address || vendingMachine.address;

        await vendingMachine.save();

        res.status(200).json(vendingMachine);
    } catch (error) {
        console.error('Error updating vending machine:', error);
        res.status(500).json({ message: 'Failed to update vending machine', error: error.message });
    }
};

exports.getPizzasByVendingMachineId = async (req, res) => {
    try {
        const { machine_id } = req.params;

        const pizzas = await PizzaAvailability.findAll({
            where: { machine_id },
            include: [{ model: Pizza, as: 'pizza' }]
        });

        if (pizzas.length > 0) {
            const pizzaDetails = pizzas.map(pizzaAvailability => ({
                id: pizzaAvailability.pizza.id,
                name: pizzaAvailability.pizza.name,
                description: pizzaAvailability.pizza.description,
                price: pizzaAvailability.pizza.price,
                photo: pizzaAvailability.pizza.photo,
                count: pizzaAvailability.count
            }));

            res.status(200).json(pizzaDetails);
        } else {
            res.status(404).json({ message: 'No pizzas found for the specified vending machine' });
        }
    } catch (error) {
        console.error('Error getting pizzas by vending machine ID:', error);
        res.status(500).json({ message: 'Failed to get pizzas by vending machine ID', error: error.message });
    }
};
