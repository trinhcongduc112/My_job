const API_URL = "http://localhost:5000/api"; // URL backend

// Helper function để xử lý response
async function handleResponse(response) {
  // Nếu request thành công nhưng không có nội dung (ví dụ: DELETE)
  if (response.status === 204) {
    return;
  }
  
  const text = await response.text();
  // Thử parse text thành JSON, nếu không được thì trả về text
  try {
    const data = JSON.parse(text);
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (err) {
    if (!response.ok) {
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }
    return text; // Trả về text nếu không phải JSON
  }
}

// Hàm helper để tạo headers có token
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // Gửi token theo chuẩn Bearer
  };
}

// Lấy tất cả việc
export async function getTodos() {
  try {
    const res = await fetch(`${API_URL}/todos`, {
      headers: getAuthHeaders()
    });
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
    const res = await fetch(`${API_URL}/todos/${id}`, { 
      method: "DELETE",
      headers: getAuthHeaders() 
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}


// Lấy một việc theo ID
export async function getTodoById(id) {
  try {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      headers: getAuthHeaders() // Gửi kèm token xác thực
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error fetching todo by id:', error);
    throw error;
  }
}