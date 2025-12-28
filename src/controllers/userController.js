import * as db from '../config/db.js';

export const searchUser = async (req, res) => {
    const { username } = req.query;
    try {
        const users = await db.query(
            "SELECT id, username FROM users WHERE username ILIKE $1",
            [`%${username}%`]
        );
        res.json(users.rows);
    } catch (err) {
        res.status(500).json({ error: "Qidiruvda xatolik" });
    }
};

export const followUser = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        await db.query(
            "INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, 'accepted') ON CONFLICT DO NOTHING",
            [userId, friendId]
        );
        res.json({ success: true, message: "Do'stlar ro'yxatiga qo'shildi" });
    } catch (err) {
        res.status(500).json({ error: "Xatolik" });
    }
};

// src/controllers/userController.js
export const searchUsers = async (req, res) => {
    const { username } = req.query;
    const currentUserId = req.user.id; // Token orqali olingan

    try {
        const users = await db.query(
            "SELECT id, username, avatar_url, bio FROM users WHERE username ILIKE $1 AND id != $2 LIMIT 10",
            [`%${username}%`, currentUserId]
        );
        res.json(users.rows);
    } catch (err) {
        res.status(500).json({ error: "Qidiruvda xatolik" });
    }
};