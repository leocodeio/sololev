import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    date: { type: String, required: true }, // YYYY-MM-DD format
  },
  { timestamps: true }
);

// Index for faster queries
TaskSchema.index({ userId: 1, date: 1 });

export const Task = mongoose.model<ITask>("Task", TaskSchema);
