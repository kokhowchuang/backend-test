"use strict";

import * as express from "express";
import { validateToken } from "../middlewares/validate_token";
import * as postController from "../controllers/post_controller";

const env = process.env.NODE_ENV || "development";
const router = express.Router();

// Routes to perform all own tasks
router.get("/posts/", postController.getPostList);
router.post("/post/", postController.createPost);
router.post("/post/:_postId/comment", postController.commentPost);

export default router;
