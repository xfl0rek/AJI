import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './pages/LoginForm';
import RegisterPage from './pages/RegisterForm';
import MainPage from './pages/MainPage';
import RegisterSuccess from './pages/RegisterSuccess';

const Layout = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerSuccess" element={<RegisterSuccess />} />
      </Routes>
    </Router>
  );
};

export default Layout;
