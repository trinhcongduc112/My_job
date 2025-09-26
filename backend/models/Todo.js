import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dueDate: { type: String },
  isCompleted: { type: Boolean, default: false },
  
  // 👇 BỔ SUNG CÁC TRƯỜNG CÒN THIẾU 👇
  note: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Todo", TodoSchema);