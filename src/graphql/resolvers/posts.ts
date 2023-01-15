import { AuthenticationError, UserInputError } from 'apollo-server';
import User from '../../models/User';
import Post from '../../models/Posts';
import { authCheck } from '../../utils/auth-check';

export const postsResolvers = {
  Query: {
    /**
     * 投稿一覧
     */
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
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

      const username = await User.findById(user.id);

      if (!username) throw new Error('該当するユーザーは見つかりませんでした。');

      const newPost = new Post({
        body,
        user: user.id,
        username: username.username,
      });

      const posts = await newPost.save();

      return posts;
    },
    /**
     * 投稿を削除
     */
    async deletePost(_: any, { postId }: { postId: string }, context: any) {
      const user = authCheck(context);

      try {
        // TODO: Promise ALL使う
        const post = await Post.findById(postId);
        const selectedUser = await User.findById(user.id);

        if (post?.username === selectedUser?.username) {
          await post?.delete();
          return '投稿の削除に成功しました。';
        }

        throw new AuthenticationError('削除が許可されていません。');
      } catch (error) {
        console.error(error);
        throw new Error('投稿の削除に失敗しました。');
      }
    },

    /**
     * いいね
     */
    async likePost(_: any, { postId }: { postId: string }, context: any) {
      const user = authCheck(context);

      // TODO: Promise ALL使う
      const post = await Post.findById(postId);
      const selectedUser = await User.findById(user.id);

      if (!post) throw new UserInputError('投稿が見つかりませんでした。');
      if (!selectedUser?.username) throw new Error('該当するユーザーは見つかりませんでした。');

      const isLikeUser = post.likes.find((like) => like.username === selectedUser.username);

      if (isLikeUser) {
        post.likes = post.likes.filter((like) => like.username !== selectedUser.username);
      } else {
        post.likes.push({
          username: selectedUser.username,
        });
      }

      await post.save();

      return post;
    },
  },
};
