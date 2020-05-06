const addTriggerArticles = `
CREATE TRIGGER articles_update_at
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE PROCEDURE update_at_timestamp();
`;

const dropTriggerArticles = `
DROP TRIGGER articles_update_at
ON articles;
`;

exports.up = knex => knex.raw(addTriggerArticles);

exports.down = knex => knex.raw(dropTriggerArticles);
