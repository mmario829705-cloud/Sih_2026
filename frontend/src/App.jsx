import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import EmergencyHelpBar from './components/EmergencyHelpBar';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingWidget from './components/FloatingWidget';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import History from './pages/History';
import PHCs from './pages/PHCs';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <EmergencyHelpBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/phcs" element={<ProtectedRoute><PHCs /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {location.pathname !== '/chat' && <FloatingWidget />}
    </div>
  );
}

export default App;
