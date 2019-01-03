'use strict';

const { Article, Feed } = require('../models');

const Query = {
  feeds: () => Feed.collection()
    .fetch()
    .then(feeds => feeds.map(feed => feed.serialize())),

  articles: (root, { feedId }) => {
    let query = Article;

    if (feedId) {
      query = query.where({ feed_id: feedId });
    }

    return query
      .fetchAll()
      .then(articles => articles.load('feed'))
      .then(articles => articles.serialize());
  },
};

module.exports = Query;
