'use strict';

const rssParser = require('../rssparser');

const { Model } = require('../bookshelf');
const { Article, Feed } = require('../models');

const Mutation = {
  addFeed: (root, { url }) => {
    let feed;
    let articles;
    return rssParser
      .get(url)
      .then(({ title, description, articles: _articles }) => {
        articles = _articles;
        return new Feed({ title, description, url }).save();
      })
      .then((_feed) => {
        feed = _feed;
        const articleModels = articles.map(
          ({
            title, link, summary, description, guid,
          }) => ({
            title,
            url: link,
            summary,
            description,
            guid,
            feed_id: feed.id,
          }),
        );

        return Article.collection()
          .add(articleModels)
          .invokeThen('save');
      })
      .then(() => feed.serialize())
      .catch((e) => {
        if (e.code === '23505') {
          throw new Error('Feed already exists');
        }

        throw e;
      });
  },

  removeFeed: (root, { id }) => new Feed({ id })
    .destroy()
    .catch((e) => {
      if (!(e instanceof Model.NoRowsDeletedError)) {
        throw e;
      }
    })
    .then(() => Feed.collection().fetch())
    .then(feeds => feeds.serialize()),
};

module.exports = Mutation;
