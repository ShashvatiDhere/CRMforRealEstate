import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Check, X } from 'lucide-react';

const PendingAgents = () => {
  const [agents, setAgents] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of agent being processed
  const [selectedManagerIds, setSelectedManagerIds] = useState({}); // mapping agentId -> managerId

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [agentsRes, managersRes] = await Promise.all([
        axiosInstance.get('/admin/pending-agents'),
        axiosInstance.get('/admin/managers')
      ]);
      setAgents(agentsRes.data.data || agentsRes.data || []);
      setManagers(managersRes.data.data || managersRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleManagerSelect = (agentId, managerId) => {
    setSelectedManagerIds(prev => ({
      ...prev,
      [agentId]: managerId
    }));
  };

  const handleAction = async (agentId, approved) => {
    const managerId = selectedManagerIds[agentId];
    
    if (approved && !managerId) {
      toast.error('Please select a manager before approving');
      return;
    }

    try {
      setActionLoading(agentId);
      const payload = {
        approved,
        managerId: approved ? parseInt(managerId) : null
      };

      await axiosInstance.put(`/admin/approve-agent/${agentId}`, payload);
      toast.success(`Agent ${approved ? 'approved' : 'rejected'} successfully`);
      
      // Remove from list
      setAgents(agents.filter(a => a.id !== agentId));
      
      // Clear selection
      const newSelections = { ...selectedManagerIds };
      delete newSelections[agentId];
      setSelectedManagerIds(newSelections);
      
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to process agent`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pending Agents</h1>
        <p className="page-subtitle">Review and approve new agent registrations.</p>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Assign Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.length > 0 ? (
                agents.map(agent => (
                  <tr key={agent.id}>
                    <td>#{agent.id}</td>
                    <td><div style={{ fontWeight: 500 }}>{agent.name}</div></td>
                    <td>{agent.email}</td>
                    <td>
                      <select 
                        className="form-input" 
                        style={{ padding: '0.375rem 0.75rem', width: '200px', marginBottom: 0 }}
                        value={selectedManagerIds[agent.id] || ''}
                        onChange={(e) => handleManagerSelect(agent.id, e.target.value)}
                        disabled={actionLoading === agent.id}
                      >
                        <option value="">Select Manager</option>
                        {managers.map(manager => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-success flex" 
                          style={{ padding: '0.375rem 0.75rem' }}
                          onClick={() => handleAction(agent.id, true)}
                          disabled={actionLoading === agent.id || !selectedManagerIds[agent.id]}
                          title={!selectedManagerIds[agent.id] ? "Select a manager first" : "Approve Agent"}
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          className="btn btn-danger flex" 
                          style={{ padding: '0.375rem 0.75rem' }}
                          onClick={() => handleAction(agent.id, false)}
                          disabled={actionLoading === agent.id}
                          title="Reject Agent"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: 'var(--color-text-muted)' }}>
                      No pending agent registrations found
                    </div>
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

export default PendingAgents;
