import Post from '../../models/Posts';
import { authCheck } from '../../utils/auth-check';

export const postsResolvers = {
  Query: {
    /**
     * 投稿一覧
     */
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        if (error instanceof Error) console.error(error);
      }
    },
    /**
     * 投稿
     */
    async getPost(_: any, { postId }: { postId: string }) {
      try {
        const post = await Post.findById(postId);

        if (!post) throw new Error('投稿が見つかりませんでした。');

        return post;
      } catch (error) {
        if (error instanceof Error) console.error(error);
      }
    },
  },
  /**
   * 投稿を追加
   */
  Mutation: {
    async createPost(_: any, { body }: { body: string }, context: any) {
      const user = authCheck(context);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
      });

      const posts = await newPost.save();

      return posts;
    },
  },
};
