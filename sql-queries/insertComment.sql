INSERT INTO comments (user_id, article_id, body)
VALUES ((SELECT user_id FROM users WHERE username = 'butter_bridge'), 1, 'Test')
RETURNING comment_id,
    'butter_bridge' as author,
    body,
    votes,
    created_at,
    updated_at;