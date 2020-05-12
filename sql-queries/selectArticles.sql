SELECT 
    users.username AS author,
    articles.title, 
    articles.article_id, 
    topics.slug AS topic, 
    articles.created_at, 
    articles.updated_at, 
    articles.votes,
    COUNT(comments.comment_id) AS comment_count
FROM articles
JOIN topics ON articles.topic_id = topics.topic_id
JOIN users ON articles.user_id = users.user_id
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE topics.slug = 'paper'
GROUP BY articles.article_id, users.username, topics.slug
ORDER BY articles.created_at DESC
LIMIT 10 OFFSET 0;