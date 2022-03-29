"use strict";

import * as express from 'express';
import { validateToken } from '../middlewares/validate_token';
import * as userController from '../controllers/user_controller';

const env = process.env.NODE_ENV || 'development';
const router = express.Router();

// Routes to perform all own tasks
router.get('/user/', [validateToken], userController.listUser);
router.delete('/user/:_userId/', [validateToken], userController.deleteUser);

export default router;