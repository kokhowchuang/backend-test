"use strict";

import * as express from 'express';
import * as appointmentController from '../controllers/appointment_controller';

const env = process.env.NODE_ENV || 'development';
const router = express.Router();

router.get('/appointments/', appointmentController.listAppointment);
router.post('/appointment/', appointmentController.saveAppointment);
router.post('/appointment/:_appointmentId', appointmentController.rescheduleAppointment);

export default router;
