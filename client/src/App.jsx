import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import WorkspacePage from './pages/WorkspacePage';
import { useAuth } from './context/AuthContext';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/*"
        element={
          <Protected>
            <WorkspacePage />
          </Protected>
        }
      />
    </Routes>
  );
}
