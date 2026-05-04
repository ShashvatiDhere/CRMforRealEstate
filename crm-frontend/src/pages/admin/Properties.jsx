import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus } from 'lucide-react';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(null);
  
  // Property Form State
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'FLAT',
    location: '',
    price: '',
    bhk: '',
    areaSqft: '',
    description: ''
  });

  const [selectedManagerIds, setSelectedManagerIds] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propRes, mgrRes] = await Promise.all([
        axiosInstance.get('/properties'),
        axiosInstance.get('/admin/managers')
      ]);
      setProperties(propRes.data.data || propRes.data || []);
      setManagers(mgrRes.data.data || mgrRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.price) {
      toast.error('Please fill required fields (Title, Location, Price)');
      return;
    }

    try {
      setSubmitLoading(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bhk: formData.bhk ? parseInt(formData.bhk) : null,
        areaSqft: formData.areaSqft ? parseFloat(formData.areaSqft) : null
      };

      await axiosInstance.post('/properties', payload);
      toast.success('Property added successfully');
      
      // Reset form and refresh list
      setFormData({
        title: '', propertyType: 'FLAT', location: '', 
        price: '', bhk: '', areaSqft: '', description: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add property');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleManagerSelect = (propertyId, managerId) => {
    setSelectedManagerIds(prev => ({
      ...prev,
      [propertyId]: managerId
    }));
  };

  const handleAssignManager = async (propertyId) => {
    const managerId = selectedManagerIds[propertyId];
    if (!managerId) {
      toast.error('Please select a manager first');
      return;
    }

    try {
      setAssignLoading(propertyId);
      await axiosInstance.put(`/properties/${propertyId}/assign-manager`, {
        managerId: parseInt(managerId)
      });
      toast.success('Manager assigned successfully');
      fetchData(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign manager');
    } finally {
      setAssignLoading(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Properties</h1>
        <p className="page-subtitle">Manage properties and assign them to managers.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Property</h2>
        <form onSubmit={handleAddProperty}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input type="text" name="title" className="form-input" value={formData.title} onChange={handleFormChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select name="propertyType" className="form-input" value={formData.propertyType} onChange={handleFormChange}>
                <option value="FLAT">Flat</option>
                <option value="VILLA">Villa</option>
                <option value="PLOT">Plot</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input type="text" name="location" className="form-input" value={formData.location} onChange={handleFormChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" name="price" className="form-input" value={formData.price} onChange={handleFormChange} required min="0" />
            </div>
            
            <div className="form-group">
              <label className="form-label">BHK</label>
              <input type="number" name="bhk" className="form-input" value={formData.bhk} onChange={handleFormChange} min="0" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Area (SqFt)</label>
              <input type="number" name="areaSqft" className="form-input" value={formData.areaSqft} onChange={handleFormChange} min="0" />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-input" 
              rows="3" 
              value={formData.description} 
              onChange={handleFormChange}
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={submitLoading}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            {submitLoading ? 'Adding...' : 'Add Property'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Property List</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Details</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Assigned Manager</th>
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
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {prop.propertyType} • {prop.bhk ? `${prop.bhk} BHK` : ''}
                        </div>
                      </td>
                      <td>{prop.location}</td>
                      <td>₹{prop.price?.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${
                          prop.status === 'AVAILABLE' ? 'success' : 
                          prop.status === 'SOLD' ? 'danger' : 'warning'
                        }`}>
                          {prop.status}
                        </span>
                      </td>
                      <td>
                        {prop.assignedManager ? (
                          prop.assignedManager.name
                        ) : (
                          <select 
                            className="form-input" 
                            style={{ padding: '0.25rem 0.5rem', margin: 0, fontSize: '0.875rem' }}
                            value={selectedManagerIds[prop.id] || ''}
                            onChange={(e) => handleManagerSelect(prop.id, e.target.value)}
                            disabled={assignLoading === prop.id}
                          >
                            <option value="">Select Manager</option>
                            {managers.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td>
                        {!prop.assignedManager && (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => handleAssignManager(prop.id)}
                            disabled={assignLoading === prop.id || !selectedManagerIds[prop.id]}
                          >
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No properties found</td>
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

export default AdminProperties;
