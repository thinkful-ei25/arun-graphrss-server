'use strict';

const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    feeds: [Feed]!
    articles(feedId: ID): [Article]!
  }

  type Mutation {
    addFeed(url: String!): Feed!
    removeFeed(id: ID!): [Feed]
  }

  type Feed {
    id: ID!
    title: String
    description: String
    url: String!
  }

  type Article {
    id: ID!
    title: String!
    url: String!
    summary: String
    description: String
    read: Boolean!
    feed: Feed!
  }
`;
