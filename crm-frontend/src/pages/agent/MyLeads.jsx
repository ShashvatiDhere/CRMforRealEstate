import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Calendar, PhoneCall, Edit2 } from 'lucide-react';

const MyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState(null);

  // Modals state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Forms state
  const [status, setStatus] = useState('');
  const [followUpForm, setFollowUpForm] = useState({ followUpDate: '', note: '' });
  const [visitForm, setVisitForm] = useState({ propertyId: '', visitDate: '', feedback: '' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/agent/my-leads');
      const leadsData = response.data.data || response.data || [];
      setLeads(leadsData);

      // Extract agentId from the first lead
      if (leadsData.length > 0 && leadsData[0].assignedAgent) {
        setAgentId(leadsData[0].assignedAgent.id);
        // Save to localStorage for other components to use
        localStorage.setItem('agentId', leadsData[0].assignedAgent.id);
      }
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Status Handlers
  const openStatusModal = (lead) => {
    setSelectedLead(lead);
    setStatus(lead.status);
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await axiosInstance.put(`/leads/${selectedLead.id}/status`, { status });
      toast.success('Status updated');
      setStatusModalOpen(false);
      fetchLeads();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Follow-Up Handlers
  const openFollowUpModal = (lead) => {
    setSelectedLead(lead);
    setFollowUpForm({ followUpDate: '', note: '' });
    setFollowUpModalOpen(true);
  };

  const handleScheduleFollowUp = async (e) => {
    e.preventDefault();
    if (!agentId) {
      toast.error('Agent ID not resolved');
      return;
    }
    
    try {
      setActionLoading(true);
      // Ensure date is ISO 8601
      const dateStr = new Date(followUpForm.followUpDate).toISOString().slice(0, 19);
      
      const payload = {
        leadId: selectedLead.id,
        agentId: agentId,
        followUpDate: dateStr,
        note: followUpForm.note
      };
      
      await axiosInstance.post('/followups', payload);
      toast.success('Follow-up scheduled');
      setFollowUpModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule follow-up');
    } finally {
      setActionLoading(false);
    }
  };

  // Site Visit Handlers
  const openVisitModal = (lead) => {
    setSelectedLead(lead);
    setVisitForm({ 
      propertyId: lead.property ? lead.property.id : '', 
      visitDate: '', 
      feedback: '' 
    });
    setVisitModalOpen(true);
  };

  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    if (!agentId) {
      toast.error('Agent ID not resolved');
      return;
    }

    if (!visitForm.propertyId) {
      toast.error('A property is required for a site visit');
      return;
    }
    
    try {
      setActionLoading(true);
      const dateStr = new Date(visitForm.visitDate).toISOString().slice(0, 19);
      
      const payload = {
        leadId: selectedLead.id,
        propertyId: parseInt(visitForm.propertyId),
        agentId: agentId,
        visitDate: dateStr,
        feedback: visitForm.feedback
      };
      
      await axiosInstance.post('/site-visits', payload);
      toast.success('Site visit scheduled');
      setVisitModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule visit');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Leads</h1>
        <p className="page-subtitle">Manage and engage with your assigned leads.</p>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Details</th>
                <th>Property</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? (
                leads.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lead.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: #{lead.id}</div>
                    </td>
                    <td>
                      <div>{lead.customerPhone}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{lead.customerEmail}</div>
                    </td>
                    <td>{lead.property ? lead.property.title : 'General Inquiry'}</td>
                    <td>₹{lead.budget?.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${
                        lead.status === 'CLOSED' ? 'success' : 
                        lead.status === 'LOST' ? 'danger' : 'primary'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-secondary flex" 
                          style={{ padding: '0.375rem', fontSize: '0.75rem' }}
                          onClick={() => openStatusModal(lead)}
                          title="Update Status"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn btn-primary flex" 
                          style={{ padding: '0.375rem', fontSize: '0.75rem' }}
                          onClick={() => openFollowUpModal(lead)}
                          title="Schedule Follow-up"
                        >
                          <PhoneCall size={16} />
                        </button>
                        <button 
                          className="btn btn-success flex" 
                          style={{ padding: '0.375rem', fontSize: '0.75rem' }}
                          onClick={() => openVisitModal(lead)}
                          title="Schedule Site Visit"
                        >
                          <Calendar size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    No leads assigned yet. Contact your manager.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title={`Update Status for ${selectedLead?.customerName}`}>
        <form onSubmit={handleUpdateStatus}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              className="form-input" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="INTERESTED">Interested</option>
              <option value="VISIT_SCHEDULED">Visit Scheduled</option>
              <option value="BOOKING">Booking</option>
              <option value="CLOSED">Closed</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={actionLoading}>
            {actionLoading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* Schedule Follow-Up Modal */}
      <Modal isOpen={followUpModalOpen} onClose={() => setFollowUpModalOpen(false)} title={`Follow-Up: ${selectedLead?.customerName}`}>
        <form onSubmit={handleScheduleFollowUp}>
          <div className="form-group">
            <label className="form-label">Date & Time *</label>
            <input 
              type="datetime-local" 
              className="form-input" 
              value={followUpForm.followUpDate}
              onChange={(e) => setFollowUpForm({...followUpForm, followUpDate: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea 
              className="form-input" 
              rows="3"
              value={followUpForm.note}
              onChange={(e) => setFollowUpForm({...followUpForm, note: e.target.value})}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={actionLoading}>
            {actionLoading ? 'Scheduling...' : 'Schedule Follow-Up'}
          </button>
        </form>
      </Modal>

      {/* Schedule Site Visit Modal */}
      <Modal isOpen={visitModalOpen} onClose={() => setVisitModalOpen(false)} title={`Site Visit: ${selectedLead?.customerName}`}>
        <form onSubmit={handleScheduleVisit}>
          <div className="form-group">
            <label className="form-label">Property ID *</label>
            <input 
              type="number" 
              className="form-input" 
              value={visitForm.propertyId}
              onChange={(e) => setVisitForm({...visitForm, propertyId: e.target.value})}
              placeholder="Enter Property ID"
              readOnly={!!selectedLead?.property}
              required
            />
            {selectedLead?.property && (
              <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                Auto-filled with lead's interested property: {selectedLead.property.title}
              </small>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Date & Time *</label>
            <input 
              type="datetime-local" 
              className="form-input" 
              value={visitForm.visitDate}
              onChange={(e) => setVisitForm({...visitForm, visitDate: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Initial Notes/Feedback (Optional)</label>
            <textarea 
              className="form-input" 
              rows="3"
              value={visitForm.feedback}
              onChange={(e) => setVisitForm({...visitForm, feedback: e.target.value})}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={actionLoading}>
            {actionLoading ? 'Scheduling...' : 'Schedule Site Visit'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default MyLeads;
