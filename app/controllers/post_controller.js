"use strict";

import mongoose from "mongoose";
import { logger } from "../config/logger";
import Post from "../models/post";

const env = process.env.NODE_ENV || "development";

export async function getPostList(req, res, next) {
  const offset = parseFloat(req.query.offset) || 1;
  const limit = 25;
  const param = {};

  if (req.query.tag) {
    param.tag = req.body.tag;
  }

  try {
    const totalRecords = await Post.find(param)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    Post.find(param)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((offset - 1) * limit)
      .lean()
      .exec(function (err, record) {
        if (err) {
          logger.error(
            "Unable to list post record in post_controller. Error: " + err
          );

          return res.status(500).json({
            errorCode: "ERR_INTERNAL_SERVER_ERROR",
            errorMessage: err.message,
          });
        }

        res.status(200).json({
          posts: record && record.length > 0 ? record : [],
          totalPosts: totalRecords.length,
        });
      });
  } catch (err) {
    logger.error(err);

    res.status(500).json({
      errorCode: "ERR_INTERNAL_SERVER_ERROR",
      errorMessage: err.message,
    });
  }
}

export async function createPost(req, res, next) {
  const userId = mongoose.Types.ObjectId(req.body.userId);
  const title = req.body.title;
  const body = req.body.body;
  const tag = req.body.tag;

  const newPost = new Post();
  newPost.userId = userId;
  newPost.title = title;
  newPost.body = body;
  newPost.tag = tag;

  newPost.save(function (err) {
    if (err) {
      logger.error("Unable to save new post in post_controller. Error: " + err);

      return res.status(500).json({
        errorCode: "ERR_INTERNAL_SERVER_ERROR",
        errorMessage: "Could not save new post",
      });
    }

    res.status(200).end();
  });
}

export async function commentPost(req, res, next) {
  const postId = mongoose.Types.ObjectId(req.params._postId);
  const userId = mongoose.Types.ObjectId(req.body.userId);
  const content = req.body.content;

  const param = { _id: postId };

  Post.findOne(param).exec(function (err, record) {
    if (err) {
      logger.error(
        "Unable to find appointment record in appointment_controller. Error: " +
          err
      );

      return res.status(500).json({
        errorCode: "ERR_INTERNAL_SERVER_ERROR",
        errorMessage: err.message,
      });
    }

    const comment = { userId, content };
    record.comment.push(comment);

    record.save(function (err) {
      if (err) {
        logger.error(
          "Unable to save new comment in comment_controller. Error: " + err
        );

        return res.status(500).json({
          errorCode: "ERR_INTERNAL_SERVER_ERROR",
          errorMessage: "Could not save new comment",
        });
      }

      res.status(200).end();
    });
  });
}
