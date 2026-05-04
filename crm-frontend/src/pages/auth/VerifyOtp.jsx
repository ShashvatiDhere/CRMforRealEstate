import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Building, ShieldCheck, Loader2 } from 'lucide-react';
import styles from './Auth.module.css';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const email = location.state?.email;

  // Protect this route if no email is passed in state
  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      
      // Checking both standard and Spring-style responses
      const resData = response.data;
      if (resData.success !== false) {
        // Backend returns: { success: true, message: "...", data: { token, email, role } }
        // Or directly the data if not wrapped
        const authData = resData.data || resData; 
        
        if (authData.token && authData.role) {
          login(authData.token, authData.email || email, authData.role);
          toast.success('Login successful!');
          
          // Redirect based on role
          const roleLower = authData.role.toLowerCase();
          navigate(`/${roleLower}/dashboard`, { replace: true });
        } else {
          toast.error('Invalid response format from server');
        }
      } else {
        toast.error(resData.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
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
          
          <h1 className={styles.title}>Verify your email</h1>
          <p className={styles.subtitle}>
            We've sent a one-time password to <br />
            <strong>{email}</strong>
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="otp" className="form-label">One-Time Password (OTP)</label>
              <input
                type="text"
                id="otp"
                className="form-input"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading}
                autoComplete="one-time-code"
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
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} style={{ marginRight: '8px' }} />
                  Verify & Sign In
                </>
              )}
            </button>
          </form>
          
          <div className={styles.links}>
            <p>
              Didn't receive the code?{' '}
              <button 
                type="button"
                className={styles.link} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => navigate('/login')}
              >
                Go back & try again
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
