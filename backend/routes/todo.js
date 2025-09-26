import express from "express";
import Todo from "../models/Todo.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Lấy danh sách todos
router.get("/", verifyToken, async (req, res) => {
  try {
    // Sắp xếp công việc mới nhất lên đầu
    const todos = await Todo.find().sort({ createdAt: -1 }); 
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ BỔ SUNG: Lấy một todo theo ID (dùng cho trang chi tiết)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Không tìm thấy công việc" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Thêm todo
router.post("/", verifyToken, async (req, res) => {
  try {
    // Chỉ lấy các trường cần thiết để bảo mật hơn
    const { name, dueDate, note, startTime, endTime } = req.body;
    const todo = await Todo.create({ name, dueDate, note, startTime, endTime });
    res.status(201).json(todo); // Dùng status 201 cho việc tạo mới
  } catch (err) {
    res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }
});

// ✅ BỔ SUNG: Sửa một todo theo ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, isCompleted, note, startTime, endTime } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { name, isCompleted, note, startTime, endTime },
      { new: true } // Trả về document đã được cập nhật
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Không tìm thấy công việc" });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ error: "Dữ liệu cập nhật không hợp lệ" });
  }
});

// ✅ BỔ SUNG: Xóa một todo theo ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Không tìm thấy công việc" });
    }
    res.status(204).send(); // Gửi status 204 (No Content) khi xóa thành công
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;