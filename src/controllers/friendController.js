import * as db from '../config/db.js';

// Do'stlik so'rovi yuborish
export const sendFriendRequest = async (req, res) => {
    const { receiverId } = req.body;
    const requesterId = req.user.id; // Middleware orqali keladi

    try {
        await db.query(
            "INSERT INTO friendships (requester_id, receiver_id) VALUES ($1, $2)",
            [requesterId, receiverId]
        );
        res.json({ success: true, message: "So'rov yuborildi" });
    } catch (err) {
        res.status(500).json({ error: "Xatolik yoki so'rov oldin yuborilgan" });
    }
};

// Kelgan so'rovlarni ko'rish
export const getPendingRequests = async (req, res) => {
    try {
        const requests = await db.query(
            `SELECT f.id, u.username, u.id as user_id 
             FROM friendships f 
             JOIN users u ON f.requester_id = u.id 
             WHERE f.receiver_id = $1 AND f.status = 'pending'`,
            [req.user.id]
        );
        res.json(requests.rows);
    } catch (err) {
        res.status(500).json({ error: "Xatolik" });
    }
};