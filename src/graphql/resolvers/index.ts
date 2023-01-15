import { postsResolvers } from './posts';
import { userResolvers } from './user';
import { commentResolvers } from './comment';
import type { PostsDoc } from '../../models/Posts';

export const resolvers = {
  Post: {
    likeCount: (parent: PostsDoc) => parent.likes.length,
    commentCount: (parent: PostsDoc) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
