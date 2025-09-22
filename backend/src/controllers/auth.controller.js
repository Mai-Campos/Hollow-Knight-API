import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const emailExist = await User.findOne({ email });

        if (emailExist) return res.status(400).json({ error: "Ya existe un usuario con ese email" });

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();
        res.status(201).json({
            message: "Usuario creado correctamente",
            user: {
                email: newUser.email,
                name: newUser.name
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ error: "El usuario no existe" });

     
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                roles: user.role

            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};