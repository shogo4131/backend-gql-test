import { model, Schema } from 'mongoose';

interface PostsDoc {
  body: string;
  username: string;
  commemts: string[];
  likes: string[];
}

const postsSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    comments: [{ body: String, name: String, createdAt: String }],
    likes: [{ name: String, createdAt: String }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true }
);

export default model<PostsDoc>('Posts', postsSchema);
