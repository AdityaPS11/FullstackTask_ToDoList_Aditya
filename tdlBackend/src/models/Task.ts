// src/models/Task.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  description: string;
}

const taskSchema = new Schema({
  description: String,
});

export default mongoose.model<ITask>('Task', taskSchema);
