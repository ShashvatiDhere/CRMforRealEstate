import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Check } from 'lucide-react';

const FollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  
  // Need to get agentId from localStorage (saved in MyLeads)
  const agentId = localStorage.getItem('agentId');

  useEffect(() => {
    if (agentId) {
      fetchFollowUps();
    } else {
      setLoading(false); // Can't fetch without agentId
    }
  }, [agentId]);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/followups/agent/${agentId}`);
      setFollowUps(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Failed to fetch follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      setActionLoading(id);
      await axiosInstance.put(`/followups/${id}/complete`);
      toast.success('Follow-up marked as completed');
      fetchFollowUps();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update follow-up');
    } finally {
      setActionLoading(null);
    }
  };

  if (!agentId) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Agent ID not found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>
          Please go to "My Leads" first so the system can resolve your Agent ID.
        </p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  const filteredFollowUps = statusFilter === 'ALL' 
    ? followUps 
    : followUps.filter(f => f.status === statusFilter);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Follow-Ups</h1>
        <p className="page-subtitle">Manage your scheduled calls and communications.</p>
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Scheduled Follow-Ups</h2>
          <div className="flex gap-2">
            <button 
              className={`btn ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.375rem 0.75rem' }}
              onClick={() => setStatusFilter('PENDING')}
            >
              Pending
            </button>
            <button 
              className={`btn ${statusFilter === 'COMPLETED' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.375rem 0.75rem' }}
              onClick={() => setStatusFilter('COMPLETED')}
            >
              Completed
            </button>
            <button 
              className={`btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.375rem 0.75rem' }}
              onClick={() => setStatusFilter('ALL')}
            >
              All
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Lead</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFollowUps.length > 0 ? (
                filteredFollowUps.map(fu => (
                  <tr key={fu.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {new Date(fu.followUpDate).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {new Date(fu.followUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>{fu.lead?.customerName || 'Unknown'}</td>
                    <td>{fu.note || '-'}</td>
                    <td>
                      <span className={`badge badge-${fu.status === 'COMPLETED' ? 'success' : fu.status === 'MISSED' ? 'danger' : 'warning'}`}>
                        {fu.status}
                      </span>
                    </td>
                    <td>
                      {fu.status === 'PENDING' && (
                        <button 
                          className="btn btn-success flex" 
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
                          onClick={() => handleMarkComplete(fu.id)}
                          disabled={actionLoading === fu.id}
                        >
                          <Check size={16} style={{ marginRight: '4px' }} />
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                    No {statusFilter.toLowerCase()} follow-ups found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FollowUps;
