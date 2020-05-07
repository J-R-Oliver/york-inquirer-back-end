const addTriggerComments = `
CREATE TRIGGER comments_update_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE PROCEDURE update_at_timestamp();
`;

const dropTriggerComments = `
DROP TRIGGER comments_update_at
ON comments;
`;

exports.up = knex => knex.raw(addTriggerComments);

exports.down = knex => knex.raw(dropTriggerComments);
