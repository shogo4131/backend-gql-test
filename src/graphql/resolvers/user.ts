import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User, { type UserDoc } from "../../models/User";

type UserRequest = {
  confirmPassword: string;
} & UserDoc;

export const userResolvers = {
  Mutation: {
    async regiser(
      _: any,
      { registerInput: { username, email, password, confirmPassword } }: any
    ) {
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
      });

      const res = await newUser.save();

      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        process.env.SERCRET_KEY || "",
        { expiresIn: "1h" }
      );

      return { ...res._doc, id: res._id, token };
    },
  },
};
