import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const AssignLead = () => {
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(null);
  const [selectedAgentIds, setSelectedAgentIds] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const leadsRes = await axiosInstance.get('/leads');
      const allLeads = leadsRes.data.data || leadsRes.data || [];
      
      // Filter unassigned leads
      const unassigned = allLeads.filter(lead => !lead.assignedAgent);
      setUnassignedLeads(unassigned);
      
      // Extract unique agents from all leads (as a workaround if /api/admin/agents is restricted)
      const uniqueAgents = [];
      const agentIds = new Set();
      
      allLeads.forEach(lead => {
        if (lead.assignedAgent && !agentIds.has(lead.assignedAgent.id)) {
          agentIds.add(lead.assignedAgent.id);
          uniqueAgents.push(lead.assignedAgent);
        }
      });
      
      // If we don't have agents from leads, let's try the admin endpoint just in case
      if (uniqueAgents.length === 0) {
        try {
          const agentsRes = await axiosInstance.get('/admin/agents');
          setAgents(agentsRes.data.data || agentsRes.data || []);
        } catch (e) {
          console.warn('Could not fetch agents directly, using extracted agents fallback');
          setAgents([]);
        }
      } else {
        setAgents(uniqueAgents);
      }
      
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSelect = (leadId, agentId) => {
    setSelectedAgentIds(prev => ({
      ...prev,
      [leadId]: agentId
    }));
  };

  const handleAssignAgent = async (leadId) => {
    const agentId = selectedAgentIds[leadId];
    if (!agentId) {
      toast.error('Please select an agent first');
      return;
    }

    try {
      setAssignLoading(leadId);
      await axiosInstance.post(`/leads/${leadId}/assign`, {
        agentId: parseInt(agentId)
      });
      toast.success('Agent assigned successfully');
      
      // Remove lead from list and clear selection
      setUnassignedLeads(prev => prev.filter(lead => lead.id !== leadId));
      const newSelections = { ...selectedAgentIds };
      delete newSelections[leadId];
      setSelectedAgentIds(newSelections);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign agent');
    } finally {
      setAssignLoading(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Assign Leads</h1>
        <p className="page-subtitle">Assign incoming leads to your agents.</p>
      </div>

      <div className="card">
        {agents.length === 0 && (
          <div className="badge badge-warning" style={{ marginBottom: '1rem', padding: '0.5rem 1rem', display: 'block' }}>
            Note: No agents appear in the dropdown yet. Please manually enter the Agent ID to assign them for the first time.
          </div>
        )}
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Customer</th>
                <th>Property Interest</th>
                <th>Budget</th>
                <th>Assign Agent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unassignedLeads.length > 0 ? (
                unassignedLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>#{lead.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{lead.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{lead.customerPhone}</div>
                    </td>
                    <td>{lead.property ? lead.property.title : 'General Inquiry'}</td>
                    <td>₹{lead.budget?.toLocaleString()}</td>
                    <td>
                      {agents.length > 0 ? (
                        <select 
                          className="form-input" 
                          style={{ padding: '0.375rem 0.75rem', margin: 0, width: '200px' }}
                          value={selectedAgentIds[lead.id] || ''}
                          onChange={(e) => handleAgentSelect(lead.id, e.target.value)}
                          disabled={assignLoading === lead.id}
                        >
                          <option value="">Select Agent</option>
                          {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          className="form-input"
                          style={{ padding: '0.375rem 0.75rem', margin: 0, width: '200px' }}
                          placeholder="Enter Agent ID"
                          value={selectedAgentIds[lead.id] || ''}
                          onChange={(e) => handleAgentSelect(lead.id, e.target.value)}
                          disabled={assignLoading === lead.id}
                        />
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.375rem 0.75rem' }}
                        onClick={() => handleAssignAgent(lead.id)}
                        disabled={assignLoading === lead.id || !selectedAgentIds[lead.id]}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: 'var(--color-text-muted)' }}>
                      No unassigned leads found. All caught up!
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

export default AssignLead;
