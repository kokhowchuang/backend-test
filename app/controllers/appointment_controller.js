"use strict";

import mongoose from 'mongoose';
import { logger } from '../config/logger';
import Appointment from '../models/appointment';

const env = process.env.NODE_ENV || 'development';

/**
 * List all appointments
 * @query {string} username 
 * @returns {array} user
 */
export async function listAppointment(req, res, next) {
  const userId = mongoose.Types.ObjectId(req.body.userId);

  Appointment.find({ userId })
    .exec(function (err, record) {
      if (err) {
        logger.error('Unable to find appointment record in appointment_controller. Error: ' + err);

        return res.status(500).json({
          errorCode: 'ERR_INTERNAL_SERVER_ERROR',
          errorMessage: err.message
        });
      }

      res.status(200).json({ appointments: record.appointments });
    });
}

/**
 * Save appointment
 * @query {string} username 
 * @returns {array} user
 */
export async function saveAppointment(req, res, next) {
  const userId = mongoose.Types.ObjectId(req.body.userId);

  Appointment.findOne({ userId })
    .exec(function (err, record) {
      if (err) {
        logger.error('Unable to find appointment record in appointment_controller. Error: ' + err);

        return res.status(500).json({
          errorCode: 'ERR_INTERNAL_SERVER_ERROR',
          errorMessage: err.message
        });
      }

      const anotherUserId = mongoose.Types.ObjectId(req.params.anotherUserId);
      const newSchedule = { userId: anotherUserId, scheduleDate: new Date(req.body.scheduleDate) };
      record.appointments.push(newSchedule);

      record.save(function (err) {
        if (err) {
          logger.error('Unable to save new image in image_controller. Error: ' + err);

          return res.status(500).json({
            errorCode: 'ERR_INTERNAL_SERVER_ERROR',
            errorMessage: 'Could not save new image'
          });
        }

        res.status(200).json({ appointments: record.appointments });
      });
    });
}

/**
 * Rechedule appointment
 * @query {string} username 
 * @returns {array} user
 */
export async function rescheduleAppointment(req, res, next) {
  const appointmentId = mongoose.Types.ObjectId(req.params._appointmentId);
  const newScheduleDate = new Date(req.body.scheduleDate);

  Appointment.find({ 'appointments._id': appointmentId })
    .exec(function (err, record) {
      if (err) {
        logger.error('Unable to find appointment record in appointment_controller. Error: ' + err);

        return res.status(500).json({
          errorCode: 'ERR_INTERNAL_SERVER_ERROR',
          errorMessage: err.message
        });
      }

      record.scheduleDate = newScheduleDate;

      if (err) {
        logger.error('Unable to reschedule appointment in appointment_controller. Error: ' + err);

        return res.status(500).json({
          errorCode: 'ERR_INTERNAL_SERVER_ERROR',
          errorMessage: 'Could not reschedule appointment'
        });
      }

      res.status(200).end();
    });
}
