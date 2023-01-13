import { model, Schema } from 'mongoose';

interface PostsDoc {
  body: string;
  username: string;
  comments: Commnet[];
  likes: string[];
}

interface Commnet {
  body: string;
  username: string;
}

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
    createdAt: { type: String },
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
