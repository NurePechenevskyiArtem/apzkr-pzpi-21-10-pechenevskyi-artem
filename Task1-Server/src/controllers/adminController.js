const Admin = require('../models/Admin')

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const VendingMachine = require("../models/VendingMachine");

exports.registerUser = async (req, res) => {
    const { email, password, name, phone_number, machine_id } = req.body;

    try {
        const existingUser = await Admin.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password.toString(), 10);

        const newUser = await Admin.create({
            email,
            password: hashedPassword,
            name,
            phone_number,
            machine_id
        });

        res.status(200).json({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            phone_number: newUser.phone_number
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let admin =
            await Admin.findOne({
                where: {
                    email: email
                }
            });

        if (!admin) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password.toString(), admin.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            {
                adminId: admin.id,
            },
            'secret-key',
            { expiresIn: '24h' }
        );
        console.log(bcrypt.hash(password.toString(), 10));


        res.status(200).json({
            token: token,
            id: admin.id,
            machine_id: admin.machine_id
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};


exports.getProfile = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }

    try {
        const decoded = jwt.verify(token, 'secret-key');
        const adminId = decoded.adminId;

        const admin = await Admin.findByPk(adminId, {
            include: {
                model: VendingMachine,
                as: 'vending_machine'
            }
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            phone_number: admin.phone_number,
            vending_machine: admin.vending_machine
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { email, name, phone_number } = req.body;
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }

    try {
        const decoded = jwt.verify(token, 'secret-key');
        const adminId = decoded.adminId;

        if (email) {
            const existingUser = await Admin.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: adminId }
                }
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
        }

        const admin = await Admin.findByPk(adminId, {
            include: {
                model: VendingMachine,
                as: 'vending_machine'
            }
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.email = email || admin.email;
        admin.name = name || admin.name;
        admin.phone_number = phone_number || admin.phone_number;

        await admin.save();

        res.status(200).json({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            phone_number: admin.phone_number,
            vending_machine: admin.vending_machine
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Profile update failed', error: error.message });
    }
};


exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }

    try {
        const decoded = jwt.verify(token, 'secret-key');
        const adminId = decoded.adminId;

        const admin = await Admin.findByPk(adminId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword.toString(), admin.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword.toString(), 10);

        admin.password = hashedNewPassword;

        await admin.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Password change failed', error: error.message });
    }
};