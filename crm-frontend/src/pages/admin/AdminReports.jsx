import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FileText, Users } from 'lucide-react';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, agentsRes] = await Promise.all([
        axiosInstance.get('/dashboard/admin'),
        axiosInstance.get('/admin/agents')
      ]);
      setData(dashRes.data);
      setAgents(agentsRes.data.data || agentsRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Executive Reports</h1>
        <p className="page-subtitle">Comprehensive overview of system performance.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--color-primary)" />
            Property Conversion Metrics
          </h3>
          <div className="flex-between" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Total Properties</span>
            <span style={{ fontWeight: '600' }}>{data?.totalProperties || 0}</span>
          </div>
          <div className="flex-between" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Available</span>
            <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>{data?.availableProperties || 0}</span>
          </div>
          <div className="flex-between">
            <span style={{ color: 'var(--color-text-muted)' }}>Sold</span>
            <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{data?.soldProperties || 0}</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--color-warning)" />
            Lead Pipeline Health
          </h3>
          <div className="flex-between" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Total Leads Generated</span>
            <span style={{ fontWeight: '600' }}>{data?.totalLeads || 0}</span>
          </div>
          <div className="flex-between" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>New Leads</span>
            <span style={{ fontWeight: '600', color: 'var(--color-warning)' }}>{data?.newLeads || 0}</span>
          </div>
          <div className="flex-between" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Successful Bookings</span>
            <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>{data?.bookings || 0}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Agent Directory</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Agent Name</th>
                <th>Email Address</th>
              </tr>
            </thead>
            <tbody>
              {agents.length > 0 ? (
                agents.map(agent => (
                  <tr key={agent.id}>
                    <td>#{agent.id}</td>
                    <td><div style={{ fontWeight: 500 }}>{agent.name}</div></td>
                    <td>{agent.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No approved agents found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
