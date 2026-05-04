import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Users, UserPlus, UserCheck, Building, 
  Home, DollarSign, List, FileText, CheckCircle, Clock, MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/dashboard/admin');
      setData(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!data) return <div className="card">No data available</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Users" value={data.totalUsers || 0} icon={Users} color="blue" />
        <StatCard title="Total Managers" value={data.totalManagers || 0} icon={UserCheck} color="purple" />
        <StatCard title="Total Agents" value={data.totalAgents || 0} icon={UserPlus} color="green" />
        <StatCard title="Pending Users" value={data.pendingUsers || 0} icon={Clock} color="orange" />
      </div>

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Properties & Leads</h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Properties" value={data.totalProperties || 0} icon={Building} color="blue" />
        <StatCard title="Available Properties" value={data.availableProperties || 0} icon={Home} color="green" />
        <StatCard title="Sold Properties" value={data.soldProperties || 0} icon={DollarSign} color="purple" />
        <StatCard title="Total Leads" value={data.totalLeads || 0} icon={List} color="blue" />
        <StatCard title="New Leads" value={data.newLeads || 0} icon={FileText} color="orange" />
      </div>

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Activity</h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Bookings" value={data.bookings || 0} icon={CheckCircle} color="green" />
        <StatCard title="Pending Follow-Ups" value={data.pendingFollowUps || 0} icon={Clock} color="orange" />
        <StatCard title="Scheduled Visits" value={data.scheduledVisits || 0} icon={MapPin} color="purple" />
      </div>
    </div>
  );
};

export default AdminDashboard;
