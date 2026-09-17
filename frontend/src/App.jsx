import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Shop from './pages/Shop';
import { getProfile } from './services/api';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const data = await getProfile();
        if (isMounted && data) {
          setUser(data);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Navbar user={user} setUser={setUser} />
        <main>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/home" element={<Home user={user} setUser={setUser} />} />
            <Route path="/" element={<Shop />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
