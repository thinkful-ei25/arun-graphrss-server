'use strict';

const rssParser = require('../rssparser');

const Mutation = {
  addFeed: (root, { url }) => rssParser
    .get(url)
    .then(feed => ({
      success: true,
      feed: {
        title: feed.title,
        description: feed.description,
        url,
      },
    }))
    .catch(error => ({
      success: false,
      message: error.message,
    })),
};

module.exports = Mutation;
