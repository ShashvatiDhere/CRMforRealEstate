import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/agent/my-properties');
      setProperties(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Properties</h1>
        <p className="page-subtitle">Properties assigned to you for showing and follow-ups.</p>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Details</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
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
                    <td>
                      {prop.bhk ? `${prop.bhk} BHK` : ''} 
                      {prop.bhk && prop.areaSqft ? ' • ' : ''}
                      {prop.areaSqft ? `${prop.areaSqft} SqFt` : ''}
                    </td>
                    <td>{prop.location}</td>
                    <td>₹{prop.price?.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${prop.status === 'AVAILABLE' ? 'success' : 'warning'}`}>
                        {prop.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: 'var(--color-text-muted)' }}>
                      No properties assigned to you yet.
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

export default MyProperties;
