import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './data/schema';

const PORT = process.env.GRAPHQL_SERVER_PORT;
const app = express();
const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    settings: {
      'editor.theme': 'light',
    },
  },
});

graphqlServer.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log('#########################################');
  console.log(
    `GraphQL Server Runing on Port: ${PORT}${graphqlServer.graphqlPath}`
  );
  console.log('#########################################');
});
