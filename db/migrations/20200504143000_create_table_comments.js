exports.up = knex => {
  return knex.schema.createTable('comments', comments => {
    comments.increments('comment_id').primary();
    comments.integer('user_id').references('users.user_id');
    comments.integer('article_id').references('articles.article_id');
    comments.string('body', 500).notNullable();
    comments.integer('votes').notNullable().defaultTo(0);
    comments.timestamps(false, true); // ([useTimestamps], [defaultToNow])
  });
};

exports.down = knex => {
  return knex.schema.dropTable('comments');
};
