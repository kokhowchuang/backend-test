"use strict";

import * as express from 'express';
import * as imageController from '../controllers/image_controller';

const env = process.env.NODE_ENV || 'development';
const router = express.Router();

router.get('/images/', imageController.listImage);
router.post('/image/', imageController.saveImage);

export default router;
