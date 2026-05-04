import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const AssignProperty = () => {
  const [properties, setProperties] = useState([]);
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
      const propsRes = await axiosInstance.get('/properties');
      setProperties(propsRes.data.data || propsRes.data || []);
      
      // Extract unique agents from leads as manager might not have direct access to agents list
      try {
        const leadsRes = await axiosInstance.get('/leads');
        const allLeads = leadsRes.data.data || leadsRes.data || [];
        
        const uniqueAgents = [];
        const agentIds = new Set();
        
        allLeads.forEach(lead => {
          if (lead.assignedAgent && !agentIds.has(lead.assignedAgent.id)) {
            agentIds.add(lead.assignedAgent.id);
            uniqueAgents.push(lead.assignedAgent);
          }
        });
        
        setAgents(uniqueAgents);
      } catch (e) {
        console.warn('Could not extract agents from leads');
        setAgents([]);
      }
      
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSelect = (propertyId, agentId) => {
    setSelectedAgentIds(prev => ({
      ...prev,
      [propertyId]: agentId
    }));
  };

  const handleAssignAgent = async (propertyId) => {
    const agentId = selectedAgentIds[propertyId];
    if (!agentId) {
      toast.error('Please select an agent first');
      return;
    }

    try {
      setAssignLoading(propertyId);
      await axiosInstance.put(`/manager/assign-property/${propertyId}/agent`, {
        agentId: parseInt(agentId)
      });
      toast.success('Agent assigned to property successfully');
      
      // Clear selection
      const newSelections = { ...selectedAgentIds };
      delete newSelections[propertyId];
      setSelectedAgentIds(newSelections);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign agent to property');
    } finally {
      setAssignLoading(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Assign Properties</h1>
        <p className="page-subtitle">Assign properties to agents for site visits and follow-ups.</p>
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
                <th>ID</th>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Assign Agent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.length > 0 ? (
                properties.map(prop => (
                  <tr key={prop.id}>
                    <td>#{prop.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{prop.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{prop.propertyType}</div>
                    </td>
                    <td>{prop.location}</td>
                    <td>
                      <span className={`badge badge-${prop.status === 'AVAILABLE' ? 'success' : 'warning'}`}>
                        {prop.status}
                      </span>
                    </td>
                    <td>
                      {agents.length > 0 ? (
                        <select 
                          className="form-input" 
                          style={{ padding: '0.375rem 0.75rem', margin: 0, width: '200px' }}
                          value={selectedAgentIds[prop.id] || ''}
                          onChange={(e) => handleAgentSelect(prop.id, e.target.value)}
                          disabled={assignLoading === prop.id}
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
                          value={selectedAgentIds[prop.id] || ''}
                          onChange={(e) => handleAgentSelect(prop.id, e.target.value)}
                          disabled={assignLoading === prop.id}
                        />
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.375rem 0.75rem' }}
                        onClick={() => handleAssignAgent(prop.id)}
                        disabled={assignLoading === prop.id || !selectedAgentIds[prop.id]}
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
                      No properties found.
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

export default AssignProperty;
