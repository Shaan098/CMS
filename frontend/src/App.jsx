import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/NotificationContainer';
import CursorGlow from './components/CursorGlow';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CMSList from './pages/CMSList';
import CMSForm from './pages/CMSForm';
import PendingApprovals from './pages/PendingApprovals';
import MySubmissions from './pages/MySubmissions';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98, filter: 'blur(10px)' }}
    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -20, scale: 1.02, filter: 'blur(10px)' }}
    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    style={{ width: '100%', minHeight: '100vh' }}
  >
    {children}
  </motion.div>
);

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cms"
          element={
            <ProtectedRoute>
              <PageWrapper><CMSList /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/cms/new"
          element={
            <ProtectedRoute>
              <PageWrapper><CMSForm /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cms/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <PageWrapper><CMSForm /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cms/pending"
          element={
            <ProtectedRoute adminOnly>
              <PageWrapper><PendingApprovals /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-submissions"
          element={
            <ProtectedRoute>
              <PageWrapper><MySubmissions /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute adminOnly>
              <PageWrapper><UserManagement /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute adminOnly>
              <PageWrapper><Reports /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute adminOnly>
              <PageWrapper><Settings /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <CursorGlow />
          <NotificationContainer />
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

