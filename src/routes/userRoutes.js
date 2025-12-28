import express from 'express';
import { searchUser } from '../controllers/userController.js';
import { sendFriendRequest, getPendingRequests } from '../controllers/friendController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/search', verifyToken, searchUser);
router.post('/request', verifyToken, sendFriendRequest);
router.get('/pending', verifyToken, getPendingRequests);

export default router;