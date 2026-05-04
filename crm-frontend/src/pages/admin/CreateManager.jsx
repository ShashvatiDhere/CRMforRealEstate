import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { UserPlus } from 'lucide-react';

const CreateManager = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setFetching(true);
      const response = await axiosInstance.get('/admin/managers');
      setManagers(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Failed to fetch managers');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/admin/create-manager', formData);
      if (response.data.success !== false) {
        toast.success('Manager created successfully');
        setFormData({ name: '', email: '' });
        fetchManagers();
      } else {
        toast.error(response.data.message || 'Failed to create manager');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating manager');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Managers</h1>
        <p className="page-subtitle">Create and view all managers in the system.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Manager</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Manager Name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="manager@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            <UserPlus size={18} style={{ marginRight: '8px' }} />
            {loading ? 'Creating...' : 'Create Manager'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Manager List</h2>
        {fetching ? (
          <LoadingSpinner />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {managers.length > 0 ? (
                  managers.map(manager => (
                    <tr key={manager.id}>
                      <td>#{manager.id}</td>
                      <td><div style={{ fontWeight: 500 }}>{manager.name}</div></td>
                      <td>{manager.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                      No managers found
                    </td>
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

export default CreateManager;
