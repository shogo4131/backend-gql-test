import { postsResolvers } from "./posts";
import { userResolvers } from "./user";

export const resolvers = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
