import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Posts";

dotenv.config();

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }

  type Query {
    getPosts: [Post]
  }
`;

const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        if (error instanceof Error) console.error(error);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(process.env.DB_CONNECT || "")
  .then(() => {
    console.log("server connected");
    return server.listen({ port: 3030 });
  })
  .then((res) => {
    console.log(`server start at ${res.url}`);
  })
  .catch((e) => {
    if (e instanceof Error) console.error(`server unconnected ${e}`);
  });
