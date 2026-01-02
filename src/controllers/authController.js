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

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                username: user.rows[0].username,
                avatar_url: user.rows[0].avatar_url
            },
            process.env.JWT_SECRET,
            { expiresIn: '365d' } // Token 1 yil davomida amal qiladi
        );

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                avatar_url: user.rows[0].avatar_url
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server xatosi" });
    }
};

// src/controllers/userController.js ichiga qo'shing
export const getPendingRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const requests = await db.query(
            `SELECT f.id, u.username, u.avatar_url, f.requester_id 
             FROM friendships f 
             JOIN users u ON f.requester_id = u.id 
             WHERE f.receiver_id = $1 AND f.status = 'pending'`,
            [userId]
        );
        res.json(requests.rows);
    } catch (err) {
        res.status(500).json({ error: "So'rovlarni olishda xatolik" });
    }
};