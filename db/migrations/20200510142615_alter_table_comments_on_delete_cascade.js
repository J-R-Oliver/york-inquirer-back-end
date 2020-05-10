exports.up = knex => {
  return knex.schema.alterTable('comments', comments => {
    comments.dropForeign('article_id');

    comments
      .integer('article_id')
      .references('articles.article_id')
      .onDelete('CASCADE')
      .alter();
  });
};

exports.down = knex => {
  return knex.schema.alterTable('comments', comments => {
    comments.dropForeign('article_id');

    comments.integer('article_id').references('articles.article_id').alter();
  });
};
