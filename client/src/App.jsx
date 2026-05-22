import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));

const AppLoading = () => (
  <div className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#111827_55%,#083344_100%)] p-6 text-white">
    <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1fr_.9fr]">
      <div>
        <div className="h-10 w-44 animate-pulse-soft rounded-full bg-white/10" />
        <div className="mt-8 h-16 max-w-2xl animate-pulse-soft rounded-3xl bg-white/10" />
        <div className="mt-4 h-16 max-w-xl animate-pulse-soft rounded-3xl bg-white/10" />
        <div className="mt-8 h-6 max-w-lg animate-pulse-soft rounded-full bg-white/10" />
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/[.08] p-5 shadow-glow">
        <div className="h-72 animate-pulse-soft rounded-3xl bg-white/10" />
      </div>
    </div>
  </div>
);

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <AppLoading />;
  }
  return user ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <Suspense fallback={<AppLoading />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/app/*"
          element={
            <Protected>
              <WorkspacePage />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
