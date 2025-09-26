// pages/CalendarPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import DropdownMenu, { DropdownItemGroup, DropdownItem } from "@atlaskit/dropdown-menu";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoApi";

export default function CalendarPage() {
  const { date } = useParams(); // yyyy-mm-dd
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");

  // kiểm tra ngày
  const todayStr = new Date().toISOString().split("T")[0];
  const isPast = date < todayStr;
  const isFuture = date > todayStr;

  // 📌 Fetch todos khi load hoặc khi đổi date
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        console.error("Lỗi tải todos:", err);
      }
    }
    fetchData();
  }, [date]);

  // lọc công việc theo ngày + tìm kiếm
  const filteredTodos = todos.filter(
    (t) =>
      t.dueDate === date &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  // thêm việc
  async function addTodoHandler() {
    const name = textInput.trim();
    if (!name) return;

    try {
      const newTodo = await addTodo({ name, dueDate: date });
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      console.error("Lỗi thêm todo:", err);
    }
    setTextInput("");
  }

  // tick hoàn thành
  async function toggleComplete(id, isCompleted) {
    try {
      const updated = await updateTodo(id, { isCompleted: !isCompleted });
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("Lỗi toggle:", err);
    }
  }

  // xóa
  async function deleteTodoHandler(id) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  }

  // sửa
  async function renameTodoHandler(id, newName) {
    try {
      const updated = await updateTodo(id, { name: newName });
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi rename:", err);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>📅 Công việc ngày {date}</h1>

      {/* Nếu không phải ngày quá khứ thì cho thêm việc */}
      {!isPast && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Textfield
            placeholder="Nhập việc cần làm..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodoHandler()}
          />
          <Button appearance="primary" onClick={addTodoHandler}>
            Thêm
          </Button>
        </div>
      )}

      {/* Thanh tìm kiếm việc */}
      <div style={{ marginBottom: 16 }}>
        <Textfield
          placeholder="🔍 Tìm việc..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isPast && (
        <p style={{ color: "gray", fontStyle: "italic" }}>
          ⏳ Đây là ngày đã qua. Bạn chỉ có thể xem lại công việc.
        </p>
      )}

      {filteredTodos.length === 0 ? (
        <p>Không có việc nào.</p>
      ) : (
        <ul>
          {filteredTodos.map((t) => (
            <li key={t._id} style={{ marginBottom: 8 }}>
              {editingId === t._id ? (
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") renameTodoHandler(t._id, draft);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <span style={{ marginRight: 8 }}>
                    {isFuture ? "📅" : t.isCompleted ? "✅" : "⏳"}
                  </span>
                  <span>{t.name}</span>
                </>
              )}

              <span style={{ marginLeft: 12 }}>
                <DropdownMenu
                  trigger={({ triggerRef, ...props }) => (
                    <Button
                      {...props}
                      ref={triggerRef}
                      appearance="subtle"
                      spacing="compact"
                    >
                      ...
                    </Button>
                  )}
                >
                  <DropdownItemGroup>
                    {isPast ? (
                      <DropdownItem isDisabled>
                        🔒 Không chỉnh sửa
                      </DropdownItem>
                    ) : (
                      <>
                        {!isFuture && (
                          <DropdownItem
                            onClick={() =>
                              toggleComplete(t._id, t.isCompleted)
                            }
                          >
                            {t.isCompleted
                              ? "Bỏ hoàn thành"
                              : "Đánh dấu hoàn thành"}
                          </DropdownItem>
                        )}
                        <DropdownItem
                          onClick={() => {
                            setEditingId(t._id);
                            setDraft(t.name);
                          }}
                        >
                          ✏️ Sửa
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => deleteTodoHandler(t._id)}
                        >
                          🗑️ Xóa
                        </DropdownItem>
                      </>
                    )}
                  </DropdownItemGroup>
                </DropdownMenu>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* quay lại danh sách chính */}
      <Link to="/">⬅️ Quay lại danh sách</Link>
    </div>
  );
}
