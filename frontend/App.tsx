
// Use import * as React to ensure JSX intrinsic elements are recognized
import * as React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BrowsePitches from './pages/BrowsePitches';
import Portfolio from './pages/Portfolio';
import InReview from './pages/InReview';
import Messages from './pages/Messages';
import Login from './pages/Login';

import Register from './pages/Register';

// Placeholder for missing components to ensure build works
const SettingsPage = () => <div className="p-8 text-2xl font-bold">Settings Page (Coming Soon)</div>;
const LogInvestmentPage = () => <div className="p-8 text-2xl font-bold">Log Investment Page (Coming Soon)</div>;
const PitchDeckViewPage = () => <div className="p-8 text-2xl font-bold">Pitch Deck Detail View (Coming Soon)</div>;

const MainLayout = () => (
  <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden">
      <Outlet />
    </main>
  </div>
);

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/browse" element={<BrowsePitches />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/in-review" element={<InReview />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/log-investment" element={<LogInvestmentPage />} />
          <Route path="/pitch/:id" element={<PitchDeckViewPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;