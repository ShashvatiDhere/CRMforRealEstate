import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Building, Home, List, FileText, 
  CheckCircle, Clock, MapPin
} from 'lucide-react';

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/dashboard/manager');
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
        <h1 className="page-title">Manager Dashboard</h1>
        <p className="page-subtitle">Track your assigned properties, leads, and agent performance.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Properties" value={data.totalProperties || 0} icon={Building} color="blue" />
        <StatCard title="Available Properties" value={data.availableProperties || 0} icon={Home} color="green" />
        <StatCard title="Total Leads" value={data.totalLeads || 0} icon={List} color="purple" />
        <StatCard title="New Leads" value={data.newLeads || 0} icon={FileText} color="orange" />
      </div>

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Active Engagement</h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Bookings" value={data.bookings || 0} icon={CheckCircle} color="green" />
        <StatCard title="Pending Follow-Ups" value={data.pendingFollowUps || 0} icon={Clock} color="orange" />
        <StatCard title="Scheduled Visits" value={data.scheduledVisits || 0} icon={MapPin} color="purple" />
      </div>
    </div>
  );
};

export default ManagerDashboard;
