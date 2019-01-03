'use strict';

exports.up = function createFeedsUp(knex, Promise) {
  return knex.schema
    .createTable('feeds', (table) => {
      table.increments('id').primary();
      table.text('title').notNullable();
      table
        .text('url')
        .notNullable()
        .unique();
      table.text('description');
    })
    .createTable('articles', (table) => {
      table.increments('id').primary();
      table.text('title').notNullable();
      table.text('url').notNullable();
      table.text('summary');
      table.text('description');
      table.text('guid');
      table.boolean('read');
      table.integer('feed_id').unsigned();
      table
        .foreign('feed_id')
        .references('feeds.id')
        .onDelete('CASCADE');
      table.unique(['feed_id', 'guid']);
    });
};

exports.down = function createFeedsDown(knex, Promise) {
  return knex.schema.dropTableIfExists('articles').dropTableIfExists('feeds');
};
