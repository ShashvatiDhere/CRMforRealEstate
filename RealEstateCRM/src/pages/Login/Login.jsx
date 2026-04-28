import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User as UserIcon, RefreshCw, KeyRound, ArrowLeft } from 'lucide-react';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); 
  
  // Form State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Admin');
  
  // OTP State
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Call Node.js backend
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP.');
      }
      
      setStep(2);
      
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setErrorMsg(err.message || 'Failed to communicate with auth server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtpInputs = [...otpInputs];
    if (value.length === 6) {
      for (let i = 0; i < 6; i++) {
        newOtpInputs[i] = value[i];
      }
      setOtpInputs(newOtpInputs);
      otpRefs[5].current.focus();
      return;
    }
    
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOTP = otpInputs.join('');
    
    if (enteredOTP.length !== 6) return;

    try {
      setIsLoading(true);
      setErrorMsg('');

      // Call Node.js backend to verify
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: enteredOTP }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid OTP code.');
      }

      // Success!
      localStorage.setItem('crm_role', role);
      navigate(`/${role.toLowerCase()}`);
      
    } catch (err) {
      setErrorMsg(err.message);
      setOtpInputs(['', '', '', '', '', '']);
      otpRefs[0].current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <div className={styles.imageOverlay}>
          <div className={styles.branding}>
            <div className={styles.logoIcon}></div>
            <h2>Aura &lt;Estate /&gt;</h2>
          </div>
          <div className={styles.heroTextContainer}>
            <h1 className={styles.heroTitle}>Discover Your <br/> Next Masterpiece.</h1>
            <p className={styles.heroSubtitle}>The premier CRM for elite real estate management and exclusive portfolio tracking.</p>
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          
          {step === 1 && (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>
                  {isLogin ? 'Welcome back.' : 'Create an account.'}
                </h2>
                <p className={styles.formSubtitle}>
                  {isLogin ? 'Sign in to access your portfolio.' : 'Join the most exclusive real estate network.'}
                </p>
              </div>

              <div className={styles.tabs}>
                <button 
                  className={`${styles.tabBtn} ${isLogin ? styles.activeTab : ''}`}
                  onClick={() => setIsLogin(true)}
                  type="button"
                >
                  Sign In
                </button>
                <button 
                  className={`${styles.tabBtn} ${!isLogin ? styles.activeTab : ''}`}
                  onClick={() => setIsLogin(false)}
                  type="button"
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleRequestOTP} className={styles.form}>
                
                {!isLogin && (
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <div className={styles.inputWrapper}>
                      <UserIcon className={styles.inputIcon} size={18} />
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin} 
                      />
                    </div>
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label>Email address</label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} size={18} />
                    <input 
                      type="email" 
                      placeholder="john@auraestate.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Simulate Role (For Demo Routing)</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Agent">Agent</option>
                  </select>
                </div>

                {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? (
                    <><RefreshCw size={18} className={styles.spin} /> Sending Code...</>
                  ) : (
                    <>{isLogin ? 'Request OTP' : 'Request OTP'} <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <div className={`${styles.form} ${styles.otpPhase}`}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back to email
              </button>
              
              <div className={styles.otpHeader}>
                <div className={styles.keyIconWrapper}>
                  <KeyRound size={28} className={styles.keyIcon} />
                </div>
                <h2 className={styles.formTitle}>Verification Code</h2>
                <p className={styles.formSubtitle}>
                  We've sent a 6-digit secure code to <span style={{fontWeight: 600, color: 'var(--text-primary)'}}>{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className={styles.form}>
                <div className={styles.otpInputsContainer}>
                  {otpInputs.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength="1"
                      className={styles.otpBox}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>

                {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

                <button type="submit" className={styles.submitBtn} disabled={isLoading || otpInputs.join('').length !== 6}>
                  {isLoading ? (
                     <><RefreshCw size={18} className={styles.spin} /> Verifying...</>
                  ) : (
                    <>Verify & Sign In <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
