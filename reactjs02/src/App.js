// App.js
import { Routes, Route } from "react-router-dom";
import TodoListPage from "./pages/TodoListPage";
import DetailPage from "./pages/DetailPage";
import CalendarPage from "./pages/CalendarPage";
import HomePage from "./pages/HomePage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/DS_ViecCanLam" element={<TodoListPage />} />
      <Route path="/detail/:id" element={<DetailPage />} />
      {/* Quan trọng: thêm param :date */}
      <Route path="/calendar/:date" element={<CalendarPage />} />
      
    </Routes>
  );
}
