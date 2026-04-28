import React from 'react';
import { Users, DollarSign, Home, Activity } from 'lucide-react';
import { Card, Metric } from '../../components/Dashboard/DashboardComponents';
import ChartWidget from '../../components/Dashboard/ChartWidget';
import styles from '../../styles/pageStyles.module.css';

const AdminDashboard = () => {
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Admin Overview</h1>
          <p className={styles.pageSubtitle}>System-wide performance and metrics</p>
        </div>
        <button className={styles.primaryBtn}>Generate Report</button>
      </div>

      <div className={styles.metricsGrid}>
        <Metric 
          title="Total Revenue" 
          value="$1.2M" 
          icon={<DollarSign size={24} />} 
          trend="up" 
          trendValue="12.5%" 
        />
        <Metric 
          title="Active Users" 
          value="1,482" 
          icon={<Users size={24} />} 
          trend="up" 
          trendValue="4.2%" 
        />
        <Metric 
          title="Total Properties" 
          value="845" 
          icon={<Home size={24} />} 
          trend="up" 
          trendValue="8.1%" 
        />
        <Metric 
          title="System Health" 
          value="99.9%" 
          icon={<Activity size={24} />} 
        />
      </div>

      <div className={styles.chartsGrid}>
        <ChartWidget 
          title="Revenue Growth" 
          data={revenueData} 
          dataKey="revenue" 
          color="#10b981" 
        />
        <Card title="Top Performing Agents">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Sarah Jenkins', 'Mike Ross', 'Jessica Pearson', 'Harvey Specter'].map((name, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>{name}</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>${(120 - i*15)}k</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
