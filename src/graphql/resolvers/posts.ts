import Post from '../../models/Posts';

export const postsResolvers = {
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
