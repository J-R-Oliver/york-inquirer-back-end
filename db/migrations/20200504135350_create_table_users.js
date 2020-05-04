exports.up = knex => {
  return knex.schema.createTable('users', users => {
    users.increments('user_id').primary();
    users.string('username').unique().notNullable();
    users.string('first_name').notNullable();
    users.string('last_name').notNullable();
    users.string('avatar_url');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('users');
};
