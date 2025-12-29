import * as db from '../config/db.js';

// Do'stlik so'rovi yuborish
// controllers/friendController.js (taxminiy ko'rinishi)

export const sendFriendRequest = async (req, res) => {
    try {
        const { friendId } = req.body; // Kimga yuborilmoqda
        const userId = req.user.id;    // Kim yuboryapti (token orqali keladi)

        // 1. O'ziga o'zi yuborishni tekshirish
        if (userId == friendId) {
            return res.status(400).json({ error: "O'zingizga match yubora olmaysiz" });
        }

        // 2. Oldin yuborilganmi yoki yo'qligini tekshirish
        const existing = await db.query(
            "SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2)",
            [userId, friendId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "So'rov allaqachon yuborilgan" });
        }

        // 3. Bazaga saqlash
        // 'pending' - hali javob berilmagan holat
        await db.query(
            "INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, 'pending')",
            [userId, friendId]
        );

        res.status(200).json({ message: "Match so'rovi muvaffaqiyatli yuborildi! ❤️" });
    } catch (err) {
        console.error("Match error:", err.message);
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
};

// controllers/friendController.js

// 1. Menga kelgan kutilayotgan so'rovlarni ko'rish
export const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.id; // Token orqali kelgan mening ID'im

        const result = await db.query(
            `SELECT f.id, u.username, u.avatar_url, u.id as sender_id 
             FROM friends f 
             JOIN users u ON f.user_id = u.id 
             WHERE f.friend_id = $1 AND f.status = 'pending'`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Pending yuklashda xato:", err.message);
        res.status(500).json({ error: "Xatolik yuz berdi" });
    }
};

// 2. So'rovga javob berish (Accept/Reject)
export const respondToRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        // Muhim: Jadval nomi 'friends' bo'lishi kerak
        await db.query(
            "UPDATE friends SET status = $1 WHERE id = $2",
            [status, requestId]
        );

        res.json({ message: "Javob yuborildi" });
    } catch (err) {
        console.error("Respond xatosi:", err.message);
        res.status(500).json({ error: "Xatolik" });
    }
};

// controllers/friendController.js

export const getAcceptedMatches = async (req, res) => {
    try {
        const userId = req.user.id;

        // Murakkabroq SQL: Men yuborgan yoki menga kelgan, 
        // lekin statusi 'accepted' bo'lgan foydalanuvchilarni topish
        const result = await db.query(
            `SELECT f.id as friendship_id, u.id as user_id, u.username, u.avatar_url, u.bio
             FROM friends f
             JOIN users u ON (f.user_id = u.id OR f.friend_id = u.id)
             WHERE (f.user_id = $1 OR f.friend_id = $1) 
               AND f.status = 'accepted' 
               AND u.id != $1`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Matches yuklashda xato:", err.message);
        res.status(500).json({ error: "Xatolik yuz berdi" });
    }
};