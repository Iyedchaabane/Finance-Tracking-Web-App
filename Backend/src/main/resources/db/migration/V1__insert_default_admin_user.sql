-- V1: Insert default admin user (by email) and default user settings

INSERT INTO _user (first_name, last_name, email, password, role)
VALUES (
           'Admin',
           'User',
           'admin@financetracker.com',
           '$2a$10$8yzajVOAuDPJ8l7eLXl4jua7AKjlKkcZ3iZLR8x/UCJ.8MxN/j31.', //Admin123!
           'ADMIN'
       )
    ON CONFLICT (email) DO NOTHING;


INSERT INTO user_settings (user_id, theme, currency, language, is_rtl)
SELECT u.id, 'light', 'EUR', 'en', FALSE
FROM _user u
WHERE u.email = 'admin@financetracker.com'
    ON CONFLICT (user_id) DO NOTHING;