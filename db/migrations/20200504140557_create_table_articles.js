exports.up = knex => {
  return knex.schema.createTable('articles', articles => {
    articles.increments('article_id').primary();
    articles.integer('topic_id').references('topics.topic_id');
    articles.integer('user_id').references('users.user_id');
    articles.string('title').unique().notNullable();
    articles.string('body', 10000);
    articles.integer('votes').notNullable().defaultTo(0);
    articles.timestamps(false, true); // ([useTimestamps], [defaultToNow])
  });
};

exports.down = knex => {
  return knex.schema.dropTable('articles');
};
