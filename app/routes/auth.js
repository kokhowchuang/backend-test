"use strict";

import * as express from 'express';
import * as authController from '../controllers/auth_controller';

const env = process.env.NODE_ENV || 'development';
const router = express.Router();

router.post('/auth/register/', authController.createUser);
router.post('/auth/login/', authController.authenticateUser);

export default router;
