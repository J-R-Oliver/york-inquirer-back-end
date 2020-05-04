exports.up = knex => {
  return knex.schema.createTable('topics', topics => {
    topics.increments('topic_id').primary();
    topics.string('slug').unique().notNullable();
    topics.string('description');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('topics');
};
