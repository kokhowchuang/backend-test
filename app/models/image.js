import mongoose from 'mongoose';
import { dbConnection } from '../config/db_connection';

const imageSchema = mongoose.Schema({
  link: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  __v: { type: Number, select: false }
},
  {
    timestamps: true,
  });

export default dbConnection.model('images', imageSchema);
