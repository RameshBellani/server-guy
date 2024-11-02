import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Context from "./Context/NewContext";
import "./App.css";

function App() {
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username) => {
    setUsername(username);
    setIsAuthenticated(true);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setUsername('');
    setIsAuthenticated(false);
    localStorage.removeItem('username');
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <Context.Provider value={{ username, setUsername, login, logout }}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        </Routes>
      </Router>
    </Context.Provider>
  );
}

export default App;
