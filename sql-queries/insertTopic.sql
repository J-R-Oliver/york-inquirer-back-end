INSERT INTO topics(slug, description)
VALUES ('Chocolate', 'Better than...')
RETURNING slug, description;