import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterForm';
import RegisterSuccess from './pages/RegisterSuccess';
import InitDatabase from './pages/InitDatabase';

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    return storedLoggedIn === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/main" /> : <WelcomePage onLogin={handleLogin} />}
        />

        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/main" /> : <WelcomePage onLogin={handleLogin} />}
        />

        <Route
          path="/main"
          element={isLoggedIn ? <MainPage onLogout={handleLogout} /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/main" /> : <RegisterPage />}
        />

        <Route
          path="/registerSuccess"
          element={<RegisterSuccess />}
        />

        <Route
          path="/initDB"
          element={isLoggedIn ? <InitDatabase /> : <Navigate to="/main" />}
        />
      </Routes>
    </div>
  );
};

export default Layout;