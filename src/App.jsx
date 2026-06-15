import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import EmergencyView from './pages/EmergencyView';

// Protected Pages
import Dashboard from './pages/Dashboard';
import MedicalProfilePage from './pages/MedicalProfilePage';
import QRCodePage from './pages/QRCodePage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import ScanHistoryPage from './pages/ScanHistoryPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';

// Route Access Protection Guard
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Publicly Accessible Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/emergency/:qrToken" element={<EmergencyView />} />

          {/* Patient Account Dashboard Controls (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MedicalProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-code"
            element={
              <ProtectedRoute>
                <QRCodePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risk-analysis"
            element={
              <ProtectedRoute>
                <RiskAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <ScanHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* System Admin Consolidation Panels (Admin Guarded) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Wildcard Fallback redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
