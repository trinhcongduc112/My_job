import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Thiếu username hoặc password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({ msg: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- LOGIN (Normal) ----------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- LOGIN (Google) ----------------
router.post("/google-login", async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) return res.status(400).json({ error: "Thiếu Google token" });

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, sub: googleId, name } = ticket.getPayload();
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        username: email?.split("@")[0] || name.replace(/\s/g, ""),
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
    console.error("❌ Lỗi Google Login:", err.message);
    res.status(500).json({ error: "Xác thực Google thất bại" });
  }
});

export default router;
