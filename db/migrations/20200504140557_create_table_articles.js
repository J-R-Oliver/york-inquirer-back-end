exports.up = knex => {
  return knex.schema.createTable('articles', articles => {
    articles.increments('article_id').primary();
    articles.string('title').unique().notNullable();
    articles.string('body');
    articles.integer('vote').defaultTo(0);
    articles.string('topic').references('topics.slug');
    articles.integer('author').references('users.user_id');
    articles.timestamps(false, true); // ([useTimestamps], [defaultToNow])
  });
};

exports.down = knex => {
  return knex.schema.dropTable('articles');
};
