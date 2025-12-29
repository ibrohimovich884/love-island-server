// controllers/userController.js
import * as db from '../config/db.js';

// 1. Qidiruv funksiyasi (Nomini 'searchUser' qildik, importga mos bo'lishi uchun)
export const searchUser = async (req, res) => {
    const { username } = req.query;
    const currentUserId = req.user.id;

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

// 2. Profilni yangilash
export const updateProfile = async (req, res) => {
    try {
        const { username, bio, avatar_url } = req.body;
        const userId = req.user.id;

        const result = await db.query(
            `UPDATE users 
             SET username = $1, bio = $2, avatar_url = $3 
             WHERE id = $4 
             RETURNING id, username, email, avatar_url, bio`,
            [username, bio, avatar_url, userId]
        );

        res.status(200).json({ message: "Profil yangilandi", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Serverda xatolik" });
    }
};

// 3. User profilini status bilan birga olish
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const myId = req.user.id;

        // User ma'lumotlari
        const userRes = await db.query("SELECT id, username, avatar_url, bio FROM users WHERE id = $1", [id]);
        if (userRes.rows.length === 0) return res.status(404).json({ error: "Topilmadi" });

        const user = userRes.rows[0];

        // Statusni tekshirish
        const statusRes = await db.query(
            "SELECT status, user_id FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)",
            [myId, id]
        );

        let friendshipStatus = "none";
        if (statusRes.rows.length > 0) {
            const row = statusRes.rows[0];
            if (row.status === 'accepted') friendshipStatus = "accepted";
            else friendshipStatus = row.user_id == myId ? "sent" : "received";
        }

        res.json({ ...user, friendshipStatus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Unlove (Aloqani o'chirish)
export const unloveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const myId = req.user.id;
        await db.query(
            "DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)",
            [myId, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Xato" });
    }
};