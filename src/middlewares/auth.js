import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(403).json({ error: "Token topilmadi" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Token ichidagi userId ni requestga qo'shamiz
        next();
    } catch (err) {
        res.status(401).json({ error: "Yaroqsiz token" });
    }
};