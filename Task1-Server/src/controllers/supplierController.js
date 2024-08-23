const Supplier = require('../models/Supplier');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerSupplier = async (req, res) => {
    const { email, password, name, company_name, company_address } = req.body;

    try {
        const existingSupplier = await Supplier.findOne({
            where: {
                email: email
            }
        });

        if (existingSupplier) {
            return res.status(400).json({ message: 'Supplier already exists' });
        }

        const hashedPassword = await bcrypt.hash(password.toString(), 10);

        const newSupplier = await Supplier.create({
            email,
            password: hashedPassword,
            name,
            company_name,
            company_address
        });

        res.status(200).json({
            id: newSupplier.id,
            email: newSupplier.email,
            name: newSupplier.name,
            company_name: newSupplier.company_name,
            company_address: newSupplier.company_address
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

exports.loginSupplier = async (req, res) => {
    try {
        const { email, password } = req.body;

        const supplier = await Supplier.findOne({
            where: {
                email: email
            }
        });

        if (!supplier) {
            return res.status(400).json({ message: 'Supplier not found' });
        }

        const isPasswordValid = await bcrypt.compare(password.toString(), supplier.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            {
                supplierId: supplier.id,
            },
            'secret-key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token: token,
            id: supplier.id,
            name: supplier.name,
            company_name: supplier.company_name
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

exports.getSupplierProfile = async (req, res) => {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        jwt.verify(token, 'secret-key', async (err, decoded) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to authenticate token' });
            }

            const supplierId = decoded.supplierId;

            const supplier = await Supplier.findByPk(supplierId, {
                attributes: ['id', 'email', 'name', 'company_name', 'company_address']
            });

            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }

            res.status(200).json(supplier);
        });
    } catch (error) {
        console.error('Error fetching supplier profile:', error);
        res.status(500).json({ message: 'Failed to fetch supplier profile', error: error.message });
    }
};

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({
            attributes: ['id', 'email', 'name', 'company_name', 'company_address']
        });

        res.status(200).json(suppliers);
    } catch (error) {
        console.error('Error fetching all suppliers:', error);
        res.status(500).json({ message: 'Failed to fetch suppliers', error: error.message });
    }
};

exports.updateSupplierProfile = async (req, res) => {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        jwt.verify(token, 'secret-key', async (err, decoded) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to authenticate token' });
            }

            const supplierId = decoded.supplierId;
            const { email, name, company_name, company_address } = req.body;

            const supplier = await Supplier.findByPk(supplierId);

            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }

            supplier.email = email || supplier.email;
            supplier.name = name || supplier.name;
            supplier.company_name = company_name || supplier.company_name;
            supplier.company_address = company_address || supplier.company_address;

            await supplier.save();

            res.status(200).json({
                id: supplier.id,
                email: supplier.email,
                name: supplier.name,
                company_name: supplier.company_name,
                company_address: supplier.company_address
            });
        });
    } catch (error) {
        console.error('Error updating supplier profile:', error);
        res.status(500).json({ message: 'Failed to update supplier profile', error: error.message });
    }
};

exports.changeSupplierPassword = async (req, res) => {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        jwt.verify(token, 'secret-key', async (err, decoded) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to authenticate token' });
            }

            const supplierId = decoded.supplierId;
            const { oldPassword, newPassword } = req.body;

            const supplier = await Supplier.findByPk(supplierId);

            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }

            const isPasswordValid = await bcrypt.compare(oldPassword.toString(), supplier.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword.toString(), 10);
            supplier.password = hashedNewPassword;

            await supplier.save();

            res.status(200).json({ message: 'Password updated successfully' });
        });
    } catch (error) {
        console.error('Error changing supplier password:', error);
        res.status(500).json({ message: 'Failed to change password', error: error.message });
    }
};

