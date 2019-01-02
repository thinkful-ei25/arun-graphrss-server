'use strict';

const { ApolloServer } = require('apollo-server');

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

/* eslint-disable no-console */
if (require.main === module) {
  server.listen({ port: 4000 }).then(({ url }) => console.log(`🚀 ${url}`));
}
