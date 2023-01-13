import { UserInputError } from 'apollo-server';
import { authCheck } from '../../utils/auth-check';
import Post from '../../models/Posts';
import User from '../../models/User';

export const commentResolvers = {
  Mutation: {
    async createComment(_: any, { postId, body }: { postId: string; body: string }, context: any) {
      const user = authCheck(context);

      if (body.trim() === '') {
        throw new UserInputError('empty comment', {
          errors: {
            body: 'コメントは必須です。',
          },
        });
      }

      const post = await Post.findById(postId);
      const selectedUser = await User.findById(user.id);

      if (!post) throw new UserInputError('投稿が見つかりませんでした。');
      if (!selectedUser) throw new Error('該当のユーザーが見つかりませんでした。');

      post.comments.unshift({ body, username: selectedUser.username });

      await post.save();

      return post;
    },
  },
};
