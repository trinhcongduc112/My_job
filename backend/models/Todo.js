import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // liên kết user
  name: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  dueDate: { type: String },
  note: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Todo", TodoSchema);
