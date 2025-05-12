import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Callback from "./pages/Callback.tsx";
import Register from "./pages/Register.tsx";
import Main from "./pages/MainPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}
