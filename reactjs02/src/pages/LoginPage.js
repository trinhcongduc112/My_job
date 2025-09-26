import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

// API URL backend
const API_URL = "http://localhost:5000/api/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Nếu đã login thì tự động vào trang chính
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // Đăng nhập thường
  async function handleLogin() {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("Đăng nhập thành công!");
        navigate("/"); // ✅ điều hướng bằng React Router
      } else {
        alert(data.error || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Có lỗi khi đăng nhập");
    }
  }

  // Đăng nhập Google
  async function handleGoogleLogin(credentialResponse) {
    console.log("Google Credential:", credentialResponse);

    try {
      const res = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: credentialResponse.credential }), // ✅ sửa lại
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("Đăng nhập Google thành công!");
        navigate("/DS_ViecCanLam");
      } else {
        alert(data.error || "Đăng nhập Google thất bại");
      }
    } catch (err) {
      console.error("Google login error:", err);
    }
  }


  // Đăng xuất
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    alert("Đã đăng xuất");
    navigate("/login"); // ✅ điều hướng
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
        <h2>Đăng nhập</h2>

        {/* Login thường */}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <button onClick={handleLogin} style={{ width: "100%", padding: 10 }}>
          Đăng nhập
        </button>

        <h3 style={{ margin: "20px 0" }}>Hoặc</h3>

        {/* Login Google */}
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log("Google Login thất bại")}
        />

        <h3 style={{ marginTop: 30 }}>Đăng xuất</h3>
        <button onClick={handleLogout} style={{ width: "100%", padding: 10 }}>
          Đăng xuất
        </button>
      </div>
    </GoogleOAuthProvider>
  );
}
