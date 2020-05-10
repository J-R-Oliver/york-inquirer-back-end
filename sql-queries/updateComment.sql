-- Unable to run query in Azure Data Studio due to PstgresSQL plugin issue

WITH updated_comment AS (
    UPDATE comments
    SET votes = votes + 6
    WHERE comments.comment_id = 2
)
SELECT 
    updated_comment.comment_id, 
    users.username AS author, 
    updated_comment.body, 
    updated_comment.votes, 
    updated_comment.created_at, 
    updated_comment.updated_at
FROM updated_comment
JOIN users ON comments.user_id = users.user_id
ORDER BY comments.created_at DESC;