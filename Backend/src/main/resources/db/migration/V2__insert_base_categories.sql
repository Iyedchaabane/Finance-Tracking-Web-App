-- V2: Insert global (admin-defined) categories
-- Global categories: is_global = TRUE, user_id = NULL

INSERT INTO category (name, icon, color, type, user_id, is_deleted, is_global)
VALUES
    -- INCOME
    ('Salary',        '💰', 'bg-green-100 text-green-600', 'INCOME',  NULL, FALSE, TRUE),
    ('Bonus',         '🎁', 'bg-yellow-100 text-yellow-600', 'INCOME', NULL, FALSE, TRUE),
    ('Investment',    '💻', 'bg-blue-100 text-blue-600', 'INCOME',    NULL, FALSE, TRUE),
    ('Other Income',  '📚', 'bg-purple-100 text-purple-600', 'INCOME',NULL, FALSE, TRUE),

    -- EXPENSE
    ('Food',          '🍽️', 'bg-red-100 text-red-600',       'EXPENSE', NULL, FALSE, TRUE),
    ('Groceries',     '🛒',  'bg-green-100 text-green-600',   'EXPENSE', NULL, FALSE, TRUE),
    ('Transport',     '🚗',  'bg-blue-100 text-blue-600',     'EXPENSE', NULL, FALSE, TRUE),
    ('Rent',          '🏠',  'bg-yellow-100 text-yellow-600', 'EXPENSE', NULL, FALSE, TRUE),
    ('Utilities',     '🧰',  'bg-purple-100 text-purple-600', 'EXPENSE', NULL, FALSE, TRUE),
    ('Electricity',   '💡',  'bg-yellow-100 text-yellow-600', 'EXPENSE', NULL, FALSE, TRUE),
    ('Entertainment', '🎬',  'bg-pink-100 text-pink-600',     'EXPENSE', NULL, FALSE, TRUE),
    ('Shopping',      '🛍️', 'bg-pink-100 text-pink-600',     'EXPENSE', NULL, FALSE, TRUE),
    ('Health',        '💊',  'bg-red-100 text-red-600',       'EXPENSE', NULL, FALSE, TRUE),
    ('Travel',        '✈️',  'bg-blue-100 text-blue-600',     'EXPENSE', NULL, FALSE, TRUE),
    ('Gaming',        '🎮',  'bg-purple-100 text-purple-600', 'EXPENSE', NULL, FALSE, TRUE);