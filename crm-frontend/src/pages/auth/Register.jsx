import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Building, UserPlus, Loader2 } from 'lucide-react';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register-agent', formData);
      if (response.data.success !== false) {
        toast.success('Registration submitted. Wait for admin approval.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authLayout}>
      <div className={styles.imageSection}>
        <div className={styles.imageOverlay}>
          <h2 className={styles.quote}>"The best investment on earth is earth."</h2>
          <p className={styles.quoteAuthor}>— Louis Glickman</p>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Building size={28} />
            </div>
            <span className={styles.logoText}>Real Estate CRM</span>
          </div>
          
          <h1 className={styles.title}>Apply as Agent</h1>
          <p className={styles.subtitle}>Create your profile to join our real estate network.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinnerIconSmall" style={{ marginRight: '8px' }} />
                  Submitting Application...
                </>
              ) : (
                <>
                  <UserPlus size={18} style={{ marginRight: '8px' }} />
                  Submit Application
                </>
              )}
            </button>
          </form>
          
          <div className={styles.links}>
            <p>
              Already have an account?{' '}
              <Link to="/login" className={styles.link}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
