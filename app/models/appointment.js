import mongoose from 'mongoose';
import { dbConnection } from '../config/db_connection';

const appointmentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true },
  appointments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    scheduleDate: { type: Date, required: true },
  }],
  __v: { type: Number, select: false }
},
  {
    timestamps: true,
  });

export default dbConnection.model('appointments', appointmentSchema);
