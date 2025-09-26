import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library"; 
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Khởi tạo Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role: role || "user" });
    res.json({ msg: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Đăng nhập bằng Google
router.post("/google-login", async (req, res) => {
  try {
    console.log("📩 Body nhận được:", req.body);

    const { tokenId } = req.body;
    if (!tokenId) {
      return res.status(400).json({ error: "Không có tokenId gửi từ frontend" });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("✅ Payload:", payload);

    const { email, sub: googleId, name } = payload;
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        username: email.split("@")[0] || name.replace(/\s/g, ""),
        email,
        googleId,
        role: "user",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("❌ Lỗi Google Login:", err);
    res.status(500).json({ error: "Google Login thất bại", details: err.message });
  }
});




export default router;