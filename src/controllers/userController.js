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

// Backend: controllers/userController.js
export const updateProfile = async (req, res) => {
    try {
        const { username, bio, avatar_url } = req.body;
        const userId = req.user.id; // Middleware orqali kelayotgan ID

        // PostgreSQL Query - Userni yangilash
        const result = await db.query(
            `UPDATE users 
             SET username = $1, bio = $2, avatar_url = $3 
             WHERE id = $4 
             RETURNING id, username, email, avatar_url, bio`,
            [username, bio, avatar_url, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
        }

        res.status(200).json({ 
            message: "Profil yangilandi", 
            user: result.rows[0] 
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
};