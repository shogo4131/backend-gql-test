import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

dotenv.config();

const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(process.env.DB_CONNECT || '')
  .then(() => {
    console.log('server connected');
    return server.listen({ port: 3030 });
  })
  .then((res) => {
    console.log(`server start at ${res.url}`);
  })
  .catch((e) => {
    if (e instanceof Error) console.error(`server unconnected ${e}`);
  });
