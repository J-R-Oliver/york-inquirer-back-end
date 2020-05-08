SELECT 
    comments.comment_id, 
    users.username AS author, 
    comments.body, 
    comments.votes, 
    comments.created_at, 
    comments.updated_at
FROM comments
JOIN users ON comments.user_id = users.user_id
WHERE comments.comment_id = 2;