-- V9: Fix user passwords to real BCrypt hashes
-- Password for all users is set to '123456'

UPDATE users SET password_hash = '$2a$10$LBCEYmXvjWMrlMORfk9zWuU4l3viBLDmLVqhHhNtFi3mWPyuFceXC'
WHERE email IN ('admin@shop.com', 'alice@email.com', 'bob@email.com', 'carol@email.com', 'staff1@shop.com');
