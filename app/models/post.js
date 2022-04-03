import mongoose from "mongoose";
import { dbConnection } from "../config/db_connection";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    tag: { type: String, required: false, trim: true },
    markedAsAnswer: { type: Boolean, required: true, default: false },
    comment: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
          index: true,
        },
        content: { type: String, required: true, trim: true },
        commentAt: { type: Date, default: Date.now },
      },
    ],
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

export default dbConnection.model("posts", postSchema);
