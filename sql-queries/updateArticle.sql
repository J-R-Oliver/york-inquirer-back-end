-- Unable to run query in Azure Data Studio due to PstgresSQL plugin issue

WITH updated_article AS (
    UPDATE articles
    SET votes = 2
    WHERE article_id = 1
    RETURNING *
)
SELECT 
    users.username AS author,
    updated_article.title, 
    updated_article.article_id, 
    updated_article.body, 
    topics.slug AS topic, 
    updated_article.created_at, 
    updated_article.updated_at, 
    updated_article.votes,
    COUNT(comments.comment_id) AS comment_count
FROM updated_article
JOIN topics ON updated_article.topic_id = topics.topic_id
JOIN users ON updated_article.user_id = users.user_id
LEFT JOIN comments ON updated_article.article_id = comments.article_id
GROUP BY 
    updated_article.article_id,     
    updated_article.title, 
    updated_article.article_id, 
    updated_article.body,
    updated_article.created_at, 
    updated_article.updated_at, 
    updated_article.votes,
    users.username, 
    topics.slug;
