'use strict';

const bookshelf = require('./bookshelf');

const Feed = bookshelf.Model.extend({
  tableName: 'feeds',
});

const Article = bookshelf.Model.extend({
  tableName: 'articles',
  feed() {
    return this.belongsTo(Feed, 'feed_id');
  },
});

module.exports = {
  Article,
  Feed,
};
