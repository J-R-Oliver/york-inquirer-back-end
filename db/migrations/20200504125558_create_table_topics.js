exports.up = knex => {
  return knex.schema.createTable('topics', topics => {
    topics.string('slug').primary();
    topics.string('description');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('houses');
};
