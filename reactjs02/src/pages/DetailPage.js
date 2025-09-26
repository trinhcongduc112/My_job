import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { getTodoById } from "../api/todoApi"; // 👈 Import hàm gọi API

const Page = styled.div`
  max-width: 720px;
  margin: 48px auto;
  padding: 16px;
`;

export default function DetailPage() {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodo() {
      try {
        // Sử dụng hàm gọi API đã được quản lý tập trung
        const data = await getTodoById(id);
        setTodo(data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết công việc:", err);
        setTodo(null); // Set là null nếu có lỗi từ server
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