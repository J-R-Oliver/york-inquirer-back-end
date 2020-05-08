SELECT username, avatar_url, CONCAT(first_name, ' ', last_name) AS name
FROM users
WHERE username = 'rogersop';