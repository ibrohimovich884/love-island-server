-- Foydalanuvchilar jadvali
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://i.pravatar.cc/150',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Friendships (Do'stlik) - status orqali boshqariladi
CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    requester_id INT REFERENCES users(id), -- Kim so'rov yubordi
    receiver_id INT REFERENCES users(id),  -- Kimga yuborildi
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);