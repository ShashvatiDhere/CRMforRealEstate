import React from 'react';
import { Target, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Card, Metric } from '../../components/Dashboard/DashboardComponents';
import ChartWidget from '../../components/Dashboard/ChartWidget';
import styles from '../../styles/pageStyles.module.css';

const ManagerDashboard = () => {
  const branchData = [
    { name: 'Week 1', sales: 12 },
    { name: 'Week 2', sales: 19 },
    { name: 'Week 3', sales: 15 },
    { name: 'Week 4', sales: 25 },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Branch Dashboard</h1>
          <p className={styles.pageSubtitle}>Downtown Branch Performance</p>
        </div>
        <button className={styles.primaryBtn}>Assign Leads</button>
      </div>

      <div className={styles.metricsGrid}>
        <Metric 
          title="Branch Target" 
          value="85%" 
          icon={<Target size={24} />} 
          trend="up" 
          trendValue="5.0%" 
        />
        <Metric 
          title="Active Listings" 
          value="124" 
          icon={<TrendingUp size={24} />} 
          trend="up" 
          trendValue="12 listings" 
        />
        <Metric 
          title="Team Size" 
          value="24" 
          icon={<Users size={24} />} 
        />
        <Metric 
          title="Closed Deals" 
          value="45" 
          icon={<CheckCircle size={24} />} 
          trend="up" 
          trendValue="8.2%" 
        />
      </div>

      <div className={styles.chartsGrid}>
        <ChartWidget 
          title="Branch Sales Trend" 
          data={branchData} 
          dataKey="sales" 
          color="#4f46e5" 
        />
        <Card title="Needs Attention">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Stale Listing: 124 Baker St</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>On market for 90+ days</p>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Agent Review: David K.</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Monthly 1-on-1 overdue</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
