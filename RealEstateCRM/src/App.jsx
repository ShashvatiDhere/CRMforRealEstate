import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard/ManagerDashboard';
import AgentDashboard from './pages/AgentDashboard/AgentDashboard';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/agent" element={<AgentDashboard />} />
          
          {/* Mock nested routes that resolve to the same dashboard for demo purposes */}
          <Route path="/admin/*" element={<Navigate to="/admin" />} />
          <Route path="/manager/*" element={<Navigate to="/manager" />} />
          <Route path="/agent/*" element={<Navigate to="/agent" />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
