import { UserInputError } from "apollo-server";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User, { type UserDoc } from "../../models/User";
import { vaidationRegisterInput } from "../../utils/validatitons";

type UserRequest = {
  confirmPassword: string;
} & UserDoc;

// TODO: anyをなんとかする
export const userResolvers = {
  Mutation: {
    async register(
      _: any,
      { registerInput: { username, email, password, confirmPassword } }: any
    ) {
      const { errors, valid } = vaidationRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) throw new UserInputError("errors", { errors });

      const user = await User.findOne({ username });

      // NOTE: 同じユーザー名の場合
      if (user) {
        throw new UserInputError("username is taken", {
          errors: { username: "this username is taken" },
        });
      }

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
