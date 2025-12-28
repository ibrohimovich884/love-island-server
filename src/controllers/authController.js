import * as db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Parolni xeshlaymiz
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Ro'yxatdan o'tishda xatolik (balki email banddir)" });
    }
};

// src/controllers/authController.js
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        }

        // MUHIM: Parolni solishtirish
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        
        if (!isMatch) {
            return res.status(400).json({ error: "Parol noto'g'ri" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });
    } catch (err) {
        res.status(500).json({ error: "Server xatosi" });
    }
};