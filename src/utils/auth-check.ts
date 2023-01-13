import { AuthenticationError } from 'apollo-server';

import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export const authCheck = (context: any) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.SERCRET_KEY || '') as Payload;

        return user;
      } catch (error) {
        throw new AuthenticationError('トークンの有効期間が無効です。');
      }
    }
    throw new Error("トークンが必須になります 'Bearer [token]'");
  }

  throw new Error('認証ヘッダーがありません。');
};
