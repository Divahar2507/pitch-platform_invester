import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import BrowsePitches from './pages/investor/BrowsePitches';
import MyPitches from './pages/startup/MyPitches';
import UploadPitch from './pages/startup/UploadPitch';
import InReview from './pages/InReview';
import Notifications from './pages/Notifications';

const Settings = () => <div className="p-4">Settings Page</div>;

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />

                        <Route path="browse-pitches" element={<BrowsePitches />} />
                        <Route path="my-pitches" element={<MyPitches />} />
                        <Route path="upload-pitch" element={<UploadPitch />} />
                        <Route path="in-review" element={<InReview />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
