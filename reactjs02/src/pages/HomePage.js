// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import Button from "@atlaskit/button";

const API_URL = process.env.REACT_APP_API_URL;

export default function HomePage() {
  const [todos, setTodos] = useState([]);
  const [showPopup, setShowPopup] = useState(true);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayTodos = todos.filter((t) => t.dueDate === todayStr);

  // gọi API khi load trang
  useEffect(() => {
    async function fetchTodos() {
      try {
        const res = await fetch(`${API_URL}/todos`);
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error("Lỗi khi load todos:", err);
      }
    }
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>🏠 Trang chính</h1>

      {/* 🔔 Thông báo */}
      {showPopup && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 8,
            backgroundColor: "#e6f4ff",
            color: "#004085",
            fontWeight: 500,
            border: "1px solid #b6daff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {todayTodos.length > 0 ? (
            <span>
              📌 Hôm nay bạn có <b>{todayTodos.length}</b> công việc cần làm.
            </span>
          ) : (
            <span>📝 Hôm nay bạn chưa có việc nào, hãy lập kế hoạch nhé!</span>
          )}

          <Button
            appearance="subtle"
            spacing="compact"
            onClick={() => setShowPopup(false)}
          >
            Ẩn
          </Button>
        </div>
      )}

      <p>👉 Hãy chọn mục "Danh sách việc" để bắt đầu quản lý công việc.</p>
    </div>
  );
}
