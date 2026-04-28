import React from 'react';
import { Calendar, MessageSquare, Phone, Home } from 'lucide-react';
import { Card, Metric } from '../../components/Dashboard/DashboardComponents';
import styles from '../../styles/pageStyles.module.css';

const AgentDashboard = () => {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Dashboard</h1>
          <p className={styles.pageSubtitle}>Here's what's happening with your leads today.</p>
        </div>
        <button className={styles.primaryBtn}>Add New Lead</button>
      </div>

      <div className={styles.metricsGrid}>
        <Metric 
          title="New Leads" 
          value="14" 
          icon={<Users size={24} />} 
          trend="up" 
          trendValue="2" 
        />
        <Metric 
          title="Upcoming Showings" 
          value="3" 
          icon={<Calendar size={24} />} 
        />
        <Metric 
          title="Unread Messages" 
          value="8" 
          icon={<MessageSquare size={24} />} 
        />
        <Metric 
          title="Active Listings" 
          value="5" 
          icon={<Home size={24} />} 
        />
      </div>

      <div className={styles.chartsGrid}>
        <Card title="Today's Schedule">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#4f46e5', minWidth: '60px' }}>10:00 AM</div>
              <div>
                <p style={{ fontWeight: 500, color: '#111827' }}>Property Showing - 451 Wall St.</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Client: Emma Stone</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#4f46e5', minWidth: '60px' }}>01:30 PM</div>
              <div>
                <p style={{ fontWeight: 500, color: '#111827' }}>Contract Signing</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Client: Ryan Gosling</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, color: '#4f46e5', minWidth: '60px' }}>04:00 PM</div>
              <div>
                <p style={{ fontWeight: 500, color: '#111827' }}>Virtual Tour Recording</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Listing: 202 Sunset Blvd.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Recent Leads">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 500 }}>John Smith</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Looking for 3BHK</p>
              </div>
              <button style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}>
                <Phone size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 500 }}>Alice Cooper</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pre-approved buyer</p>
              </div>
              <button style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}>
                <Phone size={16} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Quick mock Users icon since I forgot to import it at top
const Users = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

export default AgentDashboard;
