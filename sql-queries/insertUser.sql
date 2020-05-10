WITH insertedUser AS (
    INSERT INTO users(username, avatar_url, first_name, last_name)
    VALUES ('testing123', 'www.myimage.co.uk', 'Dave', 'Blueberry')
    RETURNING 
        users.user_id
        users.username, 
        users.avatar_url,
        CONCAT(users.first_name, ' ', users.last_name) AS name
)
SELECT 
    insertedUser.username, 
    insertedUser.avatar_url, 
    insertedUser.name, 
    COALESCE(SUM(articles.votes) + SUM(comments.votes), 0) AS total_votes 
FROM insertUser
LEFT JOIN articles ON insertedUser.user_id = articles.user_id 
LEFT JOIN comments ON insertedUser.user_id = comments.user_id
GROUP BY 
    insertedUser.user_id, 
    insertedUser.username;