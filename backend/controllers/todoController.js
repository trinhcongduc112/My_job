const Todo = require("../models/Todo");

// Lấy tất cả việc
exports.getTodos = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
};

// Thêm việc
exports.addTodo = async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.json(newTodo);
};

// Cập nhật việc
exports.updateTodo = async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Xóa việc
exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
