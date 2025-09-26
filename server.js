import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Kết nối DB và detect MongoDB
let useMongoDB = false;
let Todo = null;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/todoapp")
  .then(() => {
    console.log("✅ MongoDB connected - Sử dụng database");
    useMongoDB = true;
    
    // Todo Schema
    const TodoSchema = new mongoose.Schema({
      name: { type: String, required: true },
      isCompleted: { type: Boolean, default: false },
      dueDate: { type: String },
      note: { type: String },
      startTime: { type: String },
      endTime: { type: String },
      createdAt: { type: Date, default: Date.now }
    });
    
    Todo = mongoose.model("Todo", TodoSchema);
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("📝 Sử dụng in-memory storage (data sẽ mất khi restart server)");
    useMongoDB = false;
  });

// In-memory storage (backup khi không có MongoDB)
let todos = [];
let nextId = 1;

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Backend API đang chạy!");
});

// GET /api/todos
app.get("/api/todos", async (req, res) => {
  try {
    if (useMongoDB) {
      const todos = await Todo.find();
      res.json(todos);
    } else {
      res.json(todos);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/todos
app.post("/api/todos", async (req, res) => {
  try {
    const { name, dueDate, note, startTime, endTime } = req.body;
    
    if (useMongoDB) {
      const newTodo = new Todo({ 
        name, 
        dueDate, 
        note, 
        startTime, 
        endTime 
      });
      await newTodo.save();
      res.json(newTodo);
    } else {
      const newTodo = { 
        _id: nextId++,
        name, 
        dueDate, 
        note, 
        startTime, 
        endTime,
        isCompleted: false,
        createdAt: new Date()
      };
      todos.push(newTodo);
      res.json(newTodo);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/todos/:id
app.put("/api/todos/:id", async (req, res) => {
  try {
    if (useMongoDB) {
      const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(todo);
    } else {
      const id = parseInt(req.params.id);
      const todoIndex = todos.findIndex(t => t._id === id);
      if (todoIndex === -1) {
        return res.status(404).json({ error: "Todo not found" });
      }
      todos[todoIndex] = { ...todos[todoIndex], ...req.body };
      res.json(todos[todoIndex]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/todos/:id
app.delete("/api/todos/:id", async (req, res) => {
  try {
    if (useMongoDB) {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json({ msg: "Todo deleted" });
    } else {
      const id = parseInt(req.params.id);
      const todoIndex = todos.findIndex(t => t._id === id);
      if (todoIndex === -1) {
        return res.status(404).json({ error: "Todo not found" });
      }
      todos.splice(todoIndex, 1);
      res.json({ msg: "Todo deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server chạy tại http://localhost:${PORT}`));
