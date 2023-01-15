import { model, Schema } from 'mongoose';

export interface PostsDoc {
  body: string;
  username: string;
  comments: Commnet[];
  likes: Like[];
}

interface Commnet {
  id?: string;
  body: string;
  username: string;
}

interface Like extends Omit<Commnet, 'body'> {}

const commentsSchama = new Schema(
  {
    body: { type: String },
    username: { type: String },
  },
  { timestamps: true }
);

const likesSchema = new Schema(
  {
    username: { type: String },
  },
  { timestamps: true }
);

const postsSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    comments: [commentsSchama],
    likes: [likesSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true }
);

export default model<PostsDoc>('Posts', postsSchema);
