import express from 'express';
import { searchUser, updateProfile } from '../controllers/userController.js';
import { sendFriendRequest, getPendingRequests, respondToRequest } from '../controllers/friendController.js';
import { verifyToken } from '../middlewares/auth.js';
import * as db from '../config/db.js';

const router = express.Router();

// Foydalanuvchini qidirish
router.get('/search', verifyToken, searchUser);

// PROFILNI TAHRIRLASH (Sizda shu qator yo'q edi)
router.put('/update-profile', verifyToken, updateProfile);

// Do'stlik so'rovlari
router.post('/request', verifyToken, sendFriendRequest);
router.get('/pending', verifyToken, getPendingRequests);
router.post('/respond', verifyToken, respondToRequest);

// Backend: routes/userRoutes.js (yoki qayerda bo'lsa)
router.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Qidirilayotgan User ID:", id); // 1. ID kelayotganini tekshirish

        // SQL so'rovini eng sodda holatga keltiramiz
        const result = await db.query(
            "SELECT * FROM users WHERE id = $1", 
            [id]
        );

        if (result.rows.length === 0) {
            console.log("User topilmadi!");
            return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        }

        console.log("Topilgan user:", result.rows[0]); // 2. Ma'lumot chiqayotganini ko'rish
        res.json(result.rows[0]);
    } catch (err) {
        console.error("BACKEND XATOSI:", err.message); // 3. Xato sababini aniqlash
        res.status(500).json({ error: err.message });
    }
});



export default router;