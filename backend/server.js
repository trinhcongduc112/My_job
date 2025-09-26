// ----------------- 1. IMPORT CÁC MODULE CẦN THIẾT -----------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Import từ các file của dự án
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todo.js"; // ✅ ĐÃ SỬA LỖI: todos.js -> todo.js
import User from "./models/User.js";
import { verifyToken, isAdmin } from "./middlewares/authMiddleware.js";

// ----------------- 2. CẤU HÌNH BAN ĐẦU -----------------
// Kích hoạt biến môi trường từ file .env
dotenv.config();

// Khởi tạo Express app
const app = express();

// Sử dụng các middleware cơ bản
app.use(cors()); // Cho phép các domain khác gọi API
app.use(express.json()); // Xử lý dữ liệu JSON trong request body

// ----------------- 3. KHAI BÁO CÁC API ROUTES -----------------
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Route ví dụ yêu cầu quyền admin
app.get("/api/admin/data", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Đây là dữ liệu mật chỉ có admin mới thấy được." });
});

// ----------------- 4. KẾT NỐI DATABASE & TẠO ADMIN MẶC ĐỊNH -----------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todoapp";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Kết nối MongoDB thành công!");

    // Sau khi kết nối thành công, kiểm tra và tạo admin mặc định nếu chưa có
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      console.log("👤 Đang tạo tài khoản admin mặc định...");
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || "123456", 10);
      
      await User.create({
        username: "admin",
        password: hashedPassword,
        role: "admin"
      });
      console.log("👤 Tài khoản admin mặc định đã được tạo thành công!");
    }
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  });

// ----------------- 5. KHỞI ĐỘNG SERVER -----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});