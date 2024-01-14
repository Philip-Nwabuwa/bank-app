import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Navbar />
        <div className="py-4 px-8">
          <Routes>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </main>
  );
}

export default App;
