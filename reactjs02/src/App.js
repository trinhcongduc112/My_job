// App.js
import { Routes, Route, Navigate } from "react-router-dom";
import TodoListPage from "./pages/TodoListPage";
import DetailPage from "./pages/DetailPage";
import CalendarPage from "./pages/CalendarPage";
//import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

// HOC để bảo vệ route
function ProtectedRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      {/* Route gốc ("/") giờ đây sẽ là trang danh sách công việc được bảo vệ */}
      <Route
        path="/"
        element={<ProtectedRoute element={<TodoListPage />} />}
      />

      {/* Trang đăng nhập */}
      <Route path="/login" element={<LoginPage />} />

      {/* Các route được bảo vệ khác */}
      <Route
        path="/detail/:id"
        element={<ProtectedRoute element={<DetailPage />} />}
      />
      <Route
        path="/calendar/:date"
        element={<ProtectedRoute element={<CalendarPage />} />}
      />
      
      {/* Route cũ /DS_ViecCanLam không cần nữa vì đã có route "/" */}
    </Routes>
  );
}