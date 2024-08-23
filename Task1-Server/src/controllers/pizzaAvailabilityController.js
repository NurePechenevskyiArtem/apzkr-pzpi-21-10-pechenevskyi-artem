const PizzaAvailability = require('../models/PizzaAvailability')
const Pizza = require('../models/Pizza');
const VendingMachine = require('../models/VendingMachine');

exports.getAllPizzaAvailability = async (req, res) => {
    try {
        const pizzaAvailability = await PizzaAvailability.findAll({
            include: [
                { model: Pizza, as: 'pizza' },
                { model: VendingMachine, as: 'vending_machine' }
            ]
        });
        res.status(200).json(pizzaAvailability);
    } catch (error) {
        console.error('Error getting all pizza availability:', error);
        res.status(500).json({ message: 'Failed to get all pizza availability', error: error.message });
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


exports.createPizzaAvailability = async (req, res) => {
    try {
        const { pizza_id, machine_id, count } = req.body;

        const newPizzaAvailability = await PizzaAvailability.create({
            pizza_id,
            machine_id,
            count
        });

        res.status(201).json(newPizzaAvailability);
    } catch (error) {
        console.error('Error creating pizza availability:', error);
        res.status(500).json({ message: 'Failed to create pizza availability', error: error.message });
    }
};

exports.deletePizzaAvailabilityByPizzaIdAndMachineId = async (req, res) => {
    try {
        const { pizza_id, machine_id } = req.params;

        const pizzaAvailability = await PizzaAvailability.findOne({
            where: { pizza_id, machine_id }
        });

        if (!pizzaAvailability) {
            return res.status(404).json({ message: 'Pizza availability not found' });
        }

        await pizzaAvailability.destroy();

        res.status(204).json({ message: 'Pizza availability deleted successfully' });
    } catch (error) {
        console.error('Error deleting pizza availability:', error);
        res.status(500).json({ message: 'Failed to delete pizza availability', error: error.message });
    }
};

exports.updatePizzaCount = async (req, res) => {
    try {
        const { pizza_id, machine_id } = req.params;
        const { count } = req.body;

        const pizzaAvailability = await PizzaAvailability.findOne({
            where: { pizza_id, machine_id }
        });

        if (!pizzaAvailability) {
            return res.status(404).json({ message: 'Pizza availability not found' });
        }

        pizzaAvailability.count = count;
        await pizzaAvailability.save();

        res.status(200).json({ message: 'Pizza count updated successfully', pizzaAvailability });
    } catch (error) {
        console.error('Error updating pizza count:', error);
        res.status(500).json({ message: 'Failed to update pizza count', error: error.message });
    }
};
