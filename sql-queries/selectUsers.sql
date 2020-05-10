SELECT 
    users.username, 
    users.avatar_url, 
    CONCAT(users.first_name, ' ', users.last_name) AS name, 
    COALESCE(SUM(articles.votes) + SUM(comments.votes), 0) AS total_votes 
FROM users
LEFT JOIN articles ON users.user_id = articles.user_id 
LEFT JOIN comments ON users.user_id = comments.user_id
GROUP BY users.user_id
ORDER BY total_votes DESC;