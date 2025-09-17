const API_URL = "http://localhost:5000/api"; // URL backend

// Helper function để xử lý response
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Lấy tất cả việc
export async function getTodos() {
  try {
    const res = await fetch(`${API_URL}/todos`);
    return await handleResponse(res);
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

// Thêm việc
export async function addTodo(todo) {
  try {
    const res = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
}

// Sửa việc
export async function updateTodo(id, updates) {
  try {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

// Xóa việc
export async function deleteTodo(id) {
  try {
    const res = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}
