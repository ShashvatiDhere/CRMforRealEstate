import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context & Auth
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import VerifyOtp from './pages/auth/VerifyOtp';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateManager from './pages/admin/CreateManager';
import PendingAgents from './pages/admin/PendingAgents';
import AdminProperties from './pages/admin/Properties';
import AdminReports from './pages/admin/AdminReports';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Leads from './pages/manager/Leads';
import AssignLead from './pages/manager/AssignLead';
import AssignProperty from './pages/manager/AssignProperty';
import AgentTracking from './pages/manager/AgentTracking';
import ManagerReports from './pages/manager/ManagerReports';

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';
import MyLeads from './pages/agent/MyLeads';
import FollowUps from './pages/agent/FollowUps';
import SiteVisits from './pages/agent/SiteVisits';
import MyProperties from './pages/agent/MyProperties';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - ADMIN */}
        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-manager" element={<CreateManager />} />
            <Route path="/admin/pending-agents" element={<PendingAgents />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Route>

        {/* Protected Routes - MANAGER */}
        <Route element={<PrivateRoute allowedRoles={['MANAGER']} />}>
          <Route element={<Layout />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/leads" element={<Leads />} />
            <Route path="/manager/assign-lead" element={<AssignLead />} />
            <Route path="/manager/assign-property" element={<AssignProperty />} />
            <Route path="/manager/agent-tracking" element={<AgentTracking />} />
            <Route path="/manager/reports" element={<ManagerReports />} />
          </Route>
        </Route>

        {/* Protected Routes - AGENT */}
        <Route element={<PrivateRoute allowedRoles={['AGENT']} />}>
          <Route element={<Layout />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/my-leads" element={<MyLeads />} />
            <Route path="/agent/follow-ups" element={<FollowUps />} />
            <Route path="/agent/site-visits" element={<SiteVisits />} />
            <Route path="/agent/my-properties" element={<MyProperties />} />
          </Route>
        </Route>

        {/* Catch all - Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;
