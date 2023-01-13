import { postsResolvers } from './posts';
import { userResolvers } from './user';
import { commentResolvers } from './comment';

export const resolvers = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
