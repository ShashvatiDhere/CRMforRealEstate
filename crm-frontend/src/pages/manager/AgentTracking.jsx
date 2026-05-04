import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const AgentTracking = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
  const [loadingAgents, setLoadingAgents] = useState(true);
  
  // Tab data states
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [loadingTabData, setLoadingTabData] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedAgentId) {
      fetchTabData(selectedAgentId, activeTab);
    }
  }, [selectedAgentId, activeTab]);

  const fetchAgents = async () => {
    try {
      setLoadingAgents(true);
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
      if (uniqueAgents.length > 0) {
        setSelectedAgentId(uniqueAgents[0].id.toString());
      }
    } catch (error) {
      toast.error('Failed to load agents list');
    } finally {
      setLoadingAgents(false);
    }
  };

  const fetchTabData = async (agentId, tab) => {
    try {
      setLoadingTabData(true);
      let response;
      
      switch (tab) {
        case 'leads':
          response = await axiosInstance.get(`/manager/agents/${agentId}/leads`);
          setLeads(response.data.data || response.data || []);
          break;
        case 'properties':
          response = await axiosInstance.get(`/manager/agents/${agentId}/properties`);
          setProperties(response.data.data || response.data || []);
          break;
        case 'followups':
          response = await axiosInstance.get(`/followups/agent/${agentId}`);
          setFollowUps(response.data.data || response.data || []);
          break;
        case 'visits':
          response = await axiosInstance.get(`/site-visits/agent/${agentId}`);
          setSiteVisits(response.data.data || response.data || []);
          break;
        default:
          break;
      }
    } catch (error) {
      console.warn(`Could not fetch data for tab ${tab}`, error);
      // Fallback empty states
      setLeads([]);
      setProperties([]);
      setFollowUps([]);
      setSiteVisits([]);
    } finally {
      setLoadingTabData(false);
    }
  };

  if (loadingAgents) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Agent Tracking</h1>
        <p className="page-subtitle">Monitor individual agent performance and activities.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-group" style={{ marginBottom: 0, maxWidth: '400px' }}>
          <label className="form-label">Select Agent to Track</label>
          <select 
            className="form-input" 
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
          >
            <option value="" disabled>-- Select an Agent --</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name} ({agent.email})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedAgentId && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
            <button 
              className={`btn ${activeTab === 'leads' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0, border: 'none', borderBottom: activeTab === 'leads' ? '2px solid var(--color-primary)' : 'none', flex: 1 }}
              onClick={() => setActiveTab('leads')}
            >
              Assigned Leads
            </button>
            <button 
              className={`btn ${activeTab === 'properties' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0, border: 'none', borderBottom: activeTab === 'properties' ? '2px solid var(--color-primary)' : 'none', flex: 1 }}
              onClick={() => setActiveTab('properties')}
            >
              Properties
            </button>
            <button 
              className={`btn ${activeTab === 'followups' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0, border: 'none', borderBottom: activeTab === 'followups' ? '2px solid var(--color-primary)' : 'none', flex: 1 }}
              onClick={() => setActiveTab('followups')}
            >
              Follow-Ups
            </button>
            <button 
              className={`btn ${activeTab === 'visits' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0, border: 'none', borderBottom: activeTab === 'visits' ? '2px solid var(--color-primary)' : 'none', flex: 1 }}
              onClick={() => setActiveTab('visits')}
            >
              Site Visits
            </button>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {loadingTabData ? (
              <div style={{ padding: '2rem 0' }}><LoadingSpinner /></div>
            ) : (
              <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                {activeTab === 'leads' && (
                  <table>
                    <thead>
                      <tr><th>Lead ID</th><th>Customer Name</th><th>Status</th><th>Property</th></tr>
                    </thead>
                    <tbody>
                      {leads.length > 0 ? leads.map(l => (
                        <tr key={l.id}>
                          <td>#{l.id}</td><td>{l.customerName}</td>
                          <td><span className="badge badge-primary">{l.status}</span></td>
                          <td>{l.property ? l.property.title : 'N/A'}</td>
                        </tr>
                      )) : <tr><td colSpan="4" style={{textAlign:'center'}}>No leads assigned</td></tr>}
                    </tbody>
                  </table>
                )}

                {activeTab === 'properties' && (
                  <table>
                    <thead>
                      <tr><th>Property ID</th><th>Title</th><th>Location</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {properties.length > 0 ? properties.map(p => (
                        <tr key={p.id}>
                          <td>#{p.id}</td><td>{p.title}</td><td>{p.location}</td>
                          <td><span className="badge badge-success">{p.status}</span></td>
                        </tr>
                      )) : <tr><td colSpan="4" style={{textAlign:'center'}}>No properties assigned</td></tr>}
                    </tbody>
                  </table>
                )}

                {activeTab === 'followups' && (
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Lead</th><th>Date</th><th>Note</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {followUps.length > 0 ? followUps.map(f => (
                        <tr key={f.id}>
                          <td>#{f.id}</td><td>{f.lead?.customerName || 'Unknown'}</td>
                          <td>{new Date(f.followUpDate).toLocaleString()}</td>
                          <td>{f.note}</td>
                          <td><span className={`badge badge-${f.status === 'COMPLETED' ? 'success' : 'warning'}`}>{f.status}</span></td>
                        </tr>
                      )) : <tr><td colSpan="5" style={{textAlign:'center'}}>No follow-ups scheduled</td></tr>}
                    </tbody>
                  </table>
                )}

                {activeTab === 'visits' && (
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Lead</th><th>Property</th><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {siteVisits.length > 0 ? siteVisits.map(v => (
                        <tr key={v.id}>
                          <td>#{v.id}</td><td>{v.lead?.customerName || 'Unknown'}</td>
                          <td>{v.property?.title || 'Unknown'}</td>
                          <td>{new Date(v.visitDate).toLocaleString()}</td>
                          <td><span className={`badge badge-${v.status === 'COMPLETED' ? 'success' : v.status === 'CANCELLED' ? 'danger' : 'warning'}`}>{v.status}</span></td>
                        </tr>
                      )) : <tr><td colSpan="5" style={{textAlign:'center'}}>No site visits scheduled</td></tr>}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentTracking;
