import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Search } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    propertyId: '',
    budget: '',
    source: 'Website'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsRes, propsRes] = await Promise.all([
        axiosInstance.get('/leads'),
        axiosInstance.get('/properties')
      ]);
      setLeads(leadsRes.data.data || leadsRes.data || []);
      setProperties(propsRes.data.data || propsRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchData();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/leads/search?query=${searchTerm}`);
      setLeads(response.data.data || response.data || []);
    } catch (error) {
      // Fallback if endpoint doesn't exist exactly like that, try client side filter
      toast.error('Search failed, trying client side filter');
      try {
        const leadsRes = await axiosInstance.get('/leads');
        const allLeads = leadsRes.data.data || leadsRes.data || [];
        const filtered = allLeads.filter(l => 
          l.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          l.customerPhone?.includes(searchTerm)
        );
        setLeads(filtered);
      } catch (err) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.budget) {
      toast.error('Please fill required fields (Name, Phone, Budget)');
      return;
    }

    try {
      setSubmitLoading(true);
      const payload = {
        ...formData,
        propertyId: formData.propertyId ? parseInt(formData.propertyId) : null,
        budget: parseFloat(formData.budget)
      };

      await axiosInstance.post('/manager/leads', payload);
      toast.success('Lead created successfully');
      
      setFormData({
        customerName: '', customerPhone: '', customerEmail: '',
        propertyId: '', budget: '', source: 'Website'
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lead');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Leads Management</h1>
        <p className="page-subtitle">Create and monitor customer leads.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Lead</h2>
        <form onSubmit={handleCreateLead}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input type="text" name="customerName" className="form-input" value={formData.customerName} onChange={handleFormChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Customer Phone *</label>
              <input type="text" name="customerPhone" className="form-input" value={formData.customerPhone} onChange={handleFormChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Customer Email</label>
              <input type="email" name="customerEmail" className="form-input" value={formData.customerEmail} onChange={handleFormChange} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Interested Property</label>
              <select name="propertyId" className="form-input" value={formData.propertyId} onChange={handleFormChange}>
                <option value="">General Inquiry (No specific property)</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.title} - {p.location}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Budget (₹) *</label>
              <input type="number" name="budget" className="form-input" value={formData.budget} onChange={handleFormChange} required min="0" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Source</label>
              <input type="text" name="source" className="form-input" value={formData.source} onChange={handleFormChange} placeholder="e.g. Website, Referral, Walk-in" />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={submitLoading}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            {submitLoading ? 'Creating...' : 'Create Lead'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>All Leads</h2>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '250px', marginBottom: 0 }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
              <Search size={18} />
            </button>
          </form>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Property</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? (
                  leads.map(lead => (
                    <tr key={lead.id}>
                      <td>#{lead.id}</td>
                      <td><div style={{ fontWeight: 500 }}>{lead.customerName}</div></td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>{lead.customerPhone}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{lead.customerEmail}</div>
                      </td>
                      <td>{lead.property ? lead.property.title : 'None'}</td>
                      <td>₹{lead.budget?.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${lead.status === 'CLOSED' ? 'success' : lead.status === 'LOST' ? 'danger' : 'primary'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>{lead.assignedAgent ? lead.assignedAgent.name : 'Unassigned'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
