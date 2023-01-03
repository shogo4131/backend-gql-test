import { model, Schema } from "mongoose";

interface DocumentResult<T> extends Document {
  _doc: T;
}

interface UserDoc extends DocumentResult<UserDoc> {
  username: string;
  email: string;
  password: number;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<UserDoc>("User", userSchema);
