import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FileText, Building, List } from 'lucide-react';

const ManagerReports = () => {
  const [data, setData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [leadStatusFilter, setLeadStatusFilter] = useState('ALL');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, leadsRes, propsRes] = await Promise.all([
        axiosInstance.get('/dashboard/manager'),
        axiosInstance.get('/leads'),
        axiosInstance.get('/properties')
      ]);
      setData(dashRes.data);
      setLeads(leadsRes.data.data || leadsRes.data || []);
      setProperties(propsRes.data.data || propsRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leadStatusFilter === 'ALL' 
    ? leads 
    : leads.filter(l => l.status === leadStatusFilter);

  const filteredProperties = propertyStatusFilter === 'ALL'
    ? properties
    : properties.filter(p => p.status === propertyStatusFilter);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Performance Reports</h1>
        <p className="page-subtitle">Detailed metrics and filtered views of your portfolio.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Leads" value={data?.totalLeads || 0} icon={List} color="blue" />
        <StatCard title="Total Properties" value={data?.totalProperties || 0} icon={Building} color="purple" />
        <StatCard title="Conversion (Bookings)" value={data?.bookings || 0} icon={FileText} color="green" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Lead Status Report</h2>
            <select 
              className="form-input" 
              style={{ width: '200px', margin: 0, padding: '0.375rem 0.75rem' }}
              value={leadStatusFilter}
              onChange={(e) => setLeadStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="INTERESTED">Interested</option>
              <option value="VISIT_SCHEDULED">Visit Scheduled</option>
              <option value="BOOKING">Booking</option>
              <option value="CLOSED">Closed (Success)</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
          
          <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map(lead => (
                    <tr key={lead.id}>
                      <td>#{lead.id}</td>
                      <td>{lead.customerName}</td>
                      <td><span className="badge badge-primary">{lead.status}</span></td>
                      <td>{lead.assignedAgent?.name || 'Unassigned'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No leads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Property Status Report</h2>
            <select 
              className="form-input" 
              style={{ width: '200px', margin: 0, padding: '0.375rem 0.75rem' }}
              value={propertyStatusFilter}
              onChange={(e) => setPropertyStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="BOOKED">Booked</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
          
          <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>ID</th>
                  <th>Property Title</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map(prop => (
                    <tr key={prop.id}>
                      <td>#{prop.id}</td>
                      <td>{prop.title}</td>
                      <td>{prop.propertyType}</td>
                      <td>
                        <span className={`badge badge-${prop.status === 'AVAILABLE' ? 'success' : 'warning'}`}>
                          {prop.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No properties found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
