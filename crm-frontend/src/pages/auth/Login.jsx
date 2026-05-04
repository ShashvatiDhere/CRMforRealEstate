import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Building, ArrowRight, Loader2 } from 'lucide-react';
import styles from './Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/send-otp', { email });
      if (response.data.success || response.status === 200) {
        toast.success(response.data.message || 'OTP sent successfully to your email');
        navigate('/verify-otp', { state: { email } });
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP. Please check your email.');
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
          
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Enter your email to sign in to your account.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue with Email
                  <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>
          
          <div className={styles.links}>
            <p>
              Are you a new agent?{' '}
              <Link to="/register" className={styles.link}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
