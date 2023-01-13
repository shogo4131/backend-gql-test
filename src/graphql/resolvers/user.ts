import { UserInputError } from 'apollo-server';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/User';
import { vaidationRegisterInput, validationLoginInput } from '../../utils/validatitons';

export const userResolvers = {
  Mutation: {
    /**
     * 新規登録
     */
    async register(
      _: any,
      {
        registerInput: { username, email, password, confirmPassword },
      }: {
        registerInput: {
          username: string;
          email: string;
          password: string;
          confirmPassword: string;
        };
      }
    ) {
      const { errors, isError } = vaidationRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!isError) throw new UserInputError('errors', { errors });

      const user = await User.findOne({ username });

      // NOTE: 同じユーザー名の場合
      if (user) {
        throw new UserInputError('username is taken', {
          errors: { username: 'this username is taken' },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
      });

      const res = await newUser.save();

      const token = createToken(res);

      return { ...res._doc, id: res._id, token };
    },

    /**
     * ログイン
     */
    async login(_: any, { username, password }: { username: string; password: string }) {
      const { errors, isError } = validationLoginInput(username, password);

      if (!isError) {
        throw new UserInputError('wrong credatials。', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'ユーザー情報が見つかりません。';
        throw new UserInputError('user not found', { errors });
      }

      const passwordMatch = await bcrypt.compare(password, user.password.toString());

      if (!passwordMatch) {
        errors.general = 'パスワードが一致しません。';
        throw new UserInputError('password not match', { errors });
      }

      const token = createToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};

/**
 * token生成処理
 */
// TODO: anyを消す
const createToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.SERCRET_KEY || '',
    { expiresIn: '1h' }
  );
};
