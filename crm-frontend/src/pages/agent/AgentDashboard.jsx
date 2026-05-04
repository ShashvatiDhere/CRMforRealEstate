import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Users, Clock, MapPin, ArrowRight } from 'lucide-react';

const AgentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/dashboard/agent');
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
        <h1 className="page-title">Agent Workspace</h1>
        <p className="page-subtitle">Your daily tasks and assignments at a glance.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="My Assigned Leads" value={data.myLeads || 0} icon={Users} color="blue" />
        <StatCard title="Pending Follow-Ups" value={data.pendingFollowUps || 0} icon={Clock} color="orange" />
        <StatCard title="Scheduled Site Visits" value={data.scheduledVisits || 0} icon={MapPin} color="purple" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--color-primary)" />
            Recent Leads
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Check your newly assigned leads and update their status.
          </p>
          <Link to="/agent/my-leads" className="btn btn-primary" style={{ width: '100%' }}>
            View Leads <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </Link>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--color-warning)" />
            Today's Follow-Ups
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            You have pending follow-ups. Call your leads today.
          </p>
          <Link to="/agent/follow-ups" className="btn btn-secondary" style={{ width: '100%', borderColor: 'var(--color-warning)' }}>
            Manage Follow-Ups <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </Link>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--color-purple-500, #a855f7)" />
            Upcoming Visits
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Review site visits scheduled for your assigned properties.
          </p>
          <Link to="/agent/site-visits" className="btn btn-secondary" style={{ width: '100%', borderColor: '#a855f7' }}>
            View Schedule <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
