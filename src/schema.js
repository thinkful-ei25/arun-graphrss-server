'use strict';

const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    feeds: [Feed]!
  }

  type Mutation {
    addFeed(url: String!): FeedUpdateResponse!
  }

  type FeedUpdateResponse {
    success: Boolean!
    message: String
    feed: Feed
  }

  type Feed {
    id: ID!
    title: String
    description: String
    url: String!
  }
`;
