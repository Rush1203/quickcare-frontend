import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RootRedirect from './routes/RootRedirect';
import FloatingAIButton from './components/ai/FloatingAIButton';

import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

import PatientOverview from './pages/patient/PatientOverview';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import AIAssistant from './pages/patient/AIAssistant';

import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorPatients from './pages/doctor/DoctorPatients';

import AdminOverview from './pages/admin/AdminOverview';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminPatients from './pages/admin/AdminPatients';

function GlobalFloatingWidgets() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'patient') return null;
  if (location.pathname === '/patient/assistant') return null;

  return <FloatingAIButton />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Patient routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientPrescriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/assistant"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <AIAssistant />
          </ProtectedRoute>
        }
      />

      {/* Doctor routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorPatients />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPatients />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1C2B27',
              color: '#FBFAF7',
              fontSize: '13.5px',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
              padding: '10px 14px',
            },
            success: { iconTheme: { primary: '#5E9486', secondary: '#FBFAF7' } },
            error: { iconTheme: { primary: '#D17A78', secondary: '#FBFAF7' } },
          }}
        />
        <AppRoutes />
        <GlobalFloatingWidgets />
      </AuthProvider>
    </BrowserRouter>
  );
}
