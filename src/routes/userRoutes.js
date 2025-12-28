import express from 'express';
import { searchUser, updateProfile } from '../controllers/userController.js';
import { sendFriendRequest, getPendingRequests } from '../controllers/friendController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Foydalanuvchini qidirish
router.get('/search', verifyToken, searchUser);

// PROFILNI TAHRIRLASH (Sizda shu qator yo'q edi)
router.put('/update-profile', verifyToken, updateProfile);

// Do'stlik so'rovlari
router.post('/request', verifyToken, sendFriendRequest);
router.get('/pending', verifyToken, getPendingRequests);

export default router;