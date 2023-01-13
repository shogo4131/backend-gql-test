import { AuthenticationError, UserInputError } from 'apollo-server';
import { authCheck } from '../../utils/auth-check';
import Post from '../../models/Posts';
import User from '../../models/User';

export const commentResolvers = {
  Mutation: {
    /**
     * コメント追加
     */
    async createComment(_: any, { postId, body }: { postId: string; body: string }, context: any) {
      const user = authCheck(context);

      if (body.trim() === '') {
        throw new UserInputError('empty comment', {
          errors: {
            body: 'コメントは必須です。',
          },
        });
      }

      // TODO: Promise Allに修正
      const post = await Post.findById(postId);
      const selectedUser = await User.findById(user.id);

      if (!post) throw new UserInputError('投稿が見つかりませんでした。');
      if (!selectedUser) throw new Error('該当のユーザーが見つかりませんでした。');

      post.comments.unshift({ body, username: selectedUser.username });

      await post.save();

      return post;
    },
    /**
     * コメント削除
     */
    async deleteComment(
      _: any,
      { postId, commentId }: { postId: string; commentId: string },
      context: any
    ) {
      const user = authCheck(context);

      const post = await Post.findById(postId);
      const selectedUser = await User.findById(user.id);

      if (!post) throw new Error('投稿が見つかりませんでした。');
      if (!selectedUser) throw new Error('該当のユーザーが見つかりませんでした。');

      const commentIndex = post.comments.findIndex((c) => c.id === commentId);

      if (post.comments[commentIndex].username !== selectedUser.username) {
        throw new AuthenticationError('削除が許可されていません。');
      }

      post.comments.splice(commentIndex, 1);

      await post.save();

      return post;
    },
  },
};
