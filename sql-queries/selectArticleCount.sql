SELECT COUNT(*) AS total_count 
FROM (
    SELECT articles.article_id
    FROM articles
    JOIN topics ON articles.topic_id = topics.topic_id
    JOIN users ON articles.user_id = users.user_id
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE topics.slug = 'mitch'
    GROUP BY articles.article_id
)
AS select_articles;