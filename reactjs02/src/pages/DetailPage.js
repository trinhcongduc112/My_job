// pages/DetailPage.js
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL; // từ file .env

const Page = styled.div`
  max-width: 720px;
  margin: 48px auto;
  padding: 16px;
`;

export default function DetailPage() {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Lấy dữ liệu từ backend nếu có API
  useEffect(() => {
    async function fetchTodo() {
      try {
        const res = await fetch(`${API_URL}/todos/${id}`);
        if (!res.ok) {
          throw new Error("Không tìm thấy công việc trên server");
        }
        const data = await res.json();
        setTodo(data);
      } catch (err) {
        console.warn("❌ API lỗi, fallback sang localStorage:", err);

        // fallback localStorage nếu server chưa có
        const todoList = JSON.parse(localStorage.getItem("TODO_APP") || "[]");
        const localTodo = todoList.find((t) => t.id === id);
        setTodo(localTodo || null);
      } finally {
        setLoading(false);
      }
    }
    fetchTodo();
  }, [id]);

  if (loading) {
    return (
      <Page>
        <h2>⏳ Đang tải...</h2>
      </Page>
    );
  }

  if (!todo) {
    return (
      <Page>
        <h1>❌ Không tìm thấy công việc</h1>
        <Link to="/">⬅️ Quay lại danh sách</Link>
      </Page>
    );
  }

  return (
    <Page>
      <h1>📄 Chi tiết công việc</h1>
      <p>
        <b>Tên:</b> {todo.name}
      </p>
      <p>
        <b>Trạng thái:</b>{" "}
        {todo.isCompleted ? "✅ Hoàn thành" : "⏳ Chưa xong"}
      </p>
      {todo.note && (
        <p>
          <b>Ghi chú:</b> {todo.note}
        </p>
      )}
      <p>
        <b>Ngày tạo:</b>{" "}
        {todo.createdAt
          ? new Date(todo.createdAt).toLocaleString()
          : "Không rõ"}
      </p>

      <Link to="/">⬅️ Quay lại danh sách</Link>
    </Page>
  );
}
