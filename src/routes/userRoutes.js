import express from 'express';
import {
    searchUser,
    updateProfile,
    getUserProfile, // Qo'shildi
    unloveUser      // Qo'shildi
} from '../controllers/userController.js';
import {
    sendFriendRequest,
    getPendingRequests,
    respondToRequest,
    getAcceptedMatches
} from '../controllers/friendController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Foydalanuvchini qidirish
router.get('/search', verifyToken, searchUser);

// Profilni tahrirlash
router.put('/update-profile', verifyToken, updateProfile);

// Profilni status bilan birga olish (TO'G'RI VARIANTI)
router.get('/profile/:id', verifyToken, getUserProfile);

// Aloqani o'chirish (Unlove)
router.delete('/unlove/:id', verifyToken, unloveUser);

// Do'stlik (Love) so'rovlari
router.post('/request', verifyToken, sendFriendRequest);
router.get('/pending', verifyToken, getPendingRequests);
router.post('/respond', verifyToken, respondToRequest);
router.get('/matches', verifyToken, getAcceptedMatches);

export default router;