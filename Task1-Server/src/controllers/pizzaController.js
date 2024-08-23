const Pizza = require("../models/Pizza")
const PizzaAvailability = require("../models/PizzaAvailability");
const VendingMachine = require("../models/VendingMachine");

exports.getAllPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.findAll()

        res.status(200).json(pizzas);
    } catch (error) {
        console.error('Error getting all pizzas:', error);
        res.status(500).json({ message: 'Failed to get all pizzas', error: error.message });
    }
};

exports.getPizzaById = async (req, res) => {
    try {
        const { id } = req.params;

        const pizza = await Pizza.findByPk(id)

        if (!pizza) {
            return res.status(404).json({ message: `Pizza with id ${id} not found`});
        }
        else{
            res.status(200).json(pizza);
        }

    }
    catch (error) {
        console.error('Error getting pizza by id:', error);
        res.status(500).json({ message: 'Failed to get pizza by id', error: error.message });
    }
}

exports.updatePizzaById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, photo } = req.body;

        const pizza = await Pizza.findByPk(id);

        if (!pizza) {
            return res.status(404).json({ message: `Pizza with id ${id} not found` });
        }

        pizza.name = name || pizza.name;
        pizza.description = description || pizza.description;
        pizza.price = price || pizza.price;
        pizza.photo = photo || pizza.photo;

        await pizza.save();

        res.status(200).json(pizza);
    } catch (error) {
        console.error('Error updating pizza:', error);
        res.status(500).json({ message: 'Failed to update pizza', error: error.message });
    }
};

exports.createPizza = async (req, res) => {
    try {
        const { name, description, price, photo } = req.body;

        const newPizza = await Pizza.create({
            name, description, price, photo
        });

        res.status(201).json(newPizza);
    } catch (error) {
        console.error('Error creating pizza:', error);
        res.status(500).json({ message: 'Failed to create pizza', error: error.message });
    }
}

exports.deletePizzaById = async (req, res) => {
    try {
        const { id } = req.params;

        const pizza = await Pizza.findByPk(id);

        if (!pizza) {
            return res.status(404).json({ message: `Pizza with id ${id} not found` });
        }

        await pizza.destroy();

        res.status(204).json({ message: 'Pizza deleted successfully' });
    } catch (error) {
        console.error('Error deleting pizza:', error);
        res.status(500).json({ message: 'Failed to delete pizza', error: error.message });
    }
};