// pages/CalendarPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import DropdownMenu, { DropdownItemGroup, DropdownItem } from "@atlaskit/dropdown-menu";
import { v4 as uuid } from "uuid";

const API_URL = process.env.REACT_APP_API_URL; // dùng cho backend
const TODO_APP_STORAGE_KEY = "TODO_APP";

// -------- Helpers --------
function loadTodos() {
  try {
    const storaged = localStorage.getItem(TODO_APP_STORAGE_KEY);
    if (storaged) {
      const parsed = JSON.parse(storaged);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Cannot parse TODO_APP:", e);
  }
  return [];
}

function saveTodos(list) {
  try {
    localStorage.setItem(TODO_APP_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Cannot save TODO_APP:", e);
  }
}

// -------- Component --------
export default function CalendarPage() {
  const { date } = useParams(); // yyyy-mm-dd
  const [todos, setTodos] = useState(loadTodos());
  const [textInput, setTextInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");

  // kiểm tra ngày
  const todayStr = new Date().toISOString().split("T")[0];
  const isPast = date < todayStr;
  const isFuture = date > todayStr;

  // lọc công việc theo ngày + tìm kiếm
  const filteredTodos = todos.filter(
    (t) =>
      t.dueDate === date &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  // thêm việc (ưu tiên backend, fallback localStorage)
  async function addTodo() {
    const name = textInput.trim();
    if (!name) return;
    const newTask = {
      id: uuid(),
      name,
      isCompleted: false,
      createdAt: Date.now(),
      dueDate: date,
    };

    try {
      // nếu có API backend
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        const data = await res.json();
        setTodos([data, ...todos]);
      } else {
        throw new Error("API lỗi");
      }
    } catch (err) {
      console.warn("⚠️ Lỗi API, fallback localStorage", err);
      const updated = [newTask, ...todos];
      setTodos(updated);
      saveTodos(updated);
    }
    setTextInput("");
  }

  // tick hoàn thành
  function toggleComplete(id) {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setTodos(updated);
    saveTodos(updated);
  }

  // xóa
  function deleteTodo(id) {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  }

  // sửa
  function renameTodo(id, newName) {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, name: newName } : t
    );
    setTodos(updated);
    saveTodos(updated);
    setEditingId(null);
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
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <Button appearance="primary" onClick={addTodo}>
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
            <li key={t.id} style={{ marginBottom: 8 }}>
              {editingId === t.id ? (
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") renameTodo(t.id, draft);
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
                      <DropdownItem isDisabled>🔒 Không chỉnh sửa</DropdownItem>
                    ) : (
                      <>
                        {!isFuture && (
                          <DropdownItem onClick={() => toggleComplete(t.id)}>
                            {t.isCompleted
                              ? "Bỏ hoàn thành"
                              : "Đánh dấu hoàn thành"}
                          </DropdownItem>
                        )}
                        <DropdownItem
                          onClick={() => {
                            setEditingId(t.id);
                            setDraft(t.name);
                          }}
                        >
                          ✏️ Sửa
                        </DropdownItem>
                        <DropdownItem onClick={() => deleteTodo(t.id)}>
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
      <Link to="/DS_ViecCanLam">⬅️ Quay lại danh sách</Link>
    </div>
  );
}
