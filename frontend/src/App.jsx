import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import LoginAdmin from './pages/LoginAdmin';
import LoginUser from './pages/LoginUser';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ContentPage from './pages/ContentPage';
import ApprovalsPage from './pages/ApprovalsPage';
import MediaPage from './pages/MediaPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/admin" element={<LoginAdmin />} />
      <Route path="/login/user" element={<LoginUser />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
