'use strict';

const axios = require('axios');
const Feedparser = require('feedparser');
const stream = require('stream');

function get(feedUrl) {
  return axios.get(feedUrl).then(
    res => new Promise((resolve, reject) => {
      const parser = new Feedparser({ feedUrl });
      const feed = { articles: [] };

      parser.on('readable', function readFeed() {
        Object.assign(feed, this.meta);
        let item = this.read();
        while (item) {
          feed.articles.push(item);
          item = this.read();
        }
        resolve(feed);
      });

      parser.on('error', e => reject(e));

      const textStream = new stream.Readable();
      textStream.push(res.data);
      textStream.push(null);
      textStream.pipe(parser);
    }),
  );
}

module.exports = { get };
