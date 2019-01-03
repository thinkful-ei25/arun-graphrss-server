'use strict';

const Promise = require('bluebird');
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

  refresh: () => {
    let feeds;
    return Feed.collection()
      .fetch()
      .then((_feeds) => {
        feeds = _feeds;
        return Promise.all(feeds.map(feed => rssParser.get(feed.get('url'))));
      })
      .then((rssData) => {
        const articleCollection = rssData.reduce((acc, feedData, feedIndex) => {
          const articles = feedData.articles.map(
            ({
              title, link: url, summary, description, guid,
            }) => ({
              title,
              url,
              summary,
              description,
              guid,
              feed_id: feeds.at(feedIndex).get('id'),
            }),
          );
          return acc.add(articles);
        }, Article.collection());

        return Promise.all(
          articleCollection.map(article => article.save().catch((e) => {
            if (e.code === '23505') {
              return article.fetch();
            }
            throw e;
          })),
        );
      })
      .then(articles => articles
        .reduce((acc, article) => acc.add(article), Article.collection())
        .load('feed'))
      .then(articles => articles.serialize());
  },
};

module.exports = Mutation;
