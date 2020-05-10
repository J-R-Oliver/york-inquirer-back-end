WITH inserted_article AS (
    INSERT INTO articles(user_id, topic_id, title, body)
    VALUES (
        (SELECT user_id FROM users WHERE username = 'butter_bridge'), 
        (SELECT topic_id FROM topics WHERE slug = 'cats'),
        'tTest article', 
        'Test article about cats'
    )
    RETURNING *
)
SELECT 
    users.username AS author,
    inserted_article.title, 
    inserted_article.article_id, 
    inserted_article.body, 
    topics.slug AS topic, 
    inserted_article.created_at, 
    inserted_article.updated_at, 
    inserted_article.votes,
    COUNT(comments.comment_id) AS comment_count
FROM inserted_article
JOIN topics ON inserted_article.topic_id = topics.topic_id
JOIN users ON inserted_article.user_id = users.user_id
LEFT JOIN comments ON inserted_article.article_id = comments.article_id
GROUP BY 
    inserted_article.article_id,     
    inserted_article.title, 
    inserted_article.article_id, 
    inserted_article.body,
    inserted_article.created_at, 
    inserted_article.updated_at, 
    inserted_article.votes,
    users.username, 
    topics.slug;