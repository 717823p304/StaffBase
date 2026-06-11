import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Mail, Lock, LogIn, ArrowRight, User, X } from 'lucide-react';

const Login = () => {
  const { loginUser, loginWithGoogle, currentUser, addToast } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google Login Modal States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [useCustomGoogle, setUseCustomGoogle] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (currentUser) {
      window.location.hash = '/dashboard';
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }
    const logged = await loginUser(email, password);
    if (logged) {
      window.location.hash = '/dashboard';
    }
  };

  const handleGoogleSelect = async (demoEmail, demoName) => {
    setShowGoogleModal(false);
    // Create mock token: mock_google_token_<email>_<name>
    const mockToken = `mock_google_token_${demoEmail}_${demoName}`;
    const logged = await loginWithGoogle(mockToken);
    if (logged) {
      window.location.hash = '/dashboard';
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmail || !googleName) {
      addToast('Please fill out name and email.', 'warning');
      return;
    }
    setShowGoogleModal(false);
    const mockToken = `mock_google_token_${googleEmail.trim()}_${googleName.trim()}`;
    const logged = await loginWithGoogle(mockToken);
    if (logged) {
      window.location.hash = '/dashboard';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, var(--bg-deep) 0%, var(--bg-main) 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }} className="animate-fade-in">
      
      {/* Floating Animated Background Blobs */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', background: 'var(--bg-card)', zIndex: 10 }}>
        
        {/* Header Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <div className="sidebar-logo-badge" style={{ width: '42px', height: '42px', fontSize: '1.25rem' }}>SB</div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Staff<span style={{ color: 'var(--primary)' }}>Base</span> Portal
            </h1>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: 'var(--text-muted)' }}>
              Secure Workspaces
            </span>
          </div>
        </div>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          Welcome Back
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          Access your staff dashboard, documents compliance vault, and HR operations.
        </p>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Corporate Email</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', color: 'var(--primary)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="sarah@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Security Password</label>
              <a href="#/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--primary)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>
            <span>Sign In to Workspace</span>
            <LogIn size={18} />
          </button>
        </form>

        {/* Continue with Google Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1rem 0 0.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>First time onboarding? </span>
          <a href="#/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Request Profile</a>
        </div>

      </div>

      {/* Simulated Google OAuth Account Chooser Modal */}
      {showGoogleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="glass-card animate-scale-in" style={{
            maxWidth: '380px',
            width: '100%',
            padding: '2rem',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <button
              onClick={() => { setShowGoogleModal(false); setUseCustomGoogle(false); }}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Google Logo */}
            <div style={{ marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Choose an account</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>to continue to StaffBase Portal</p>

            {!useCustomGoogle ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <button
                  onClick={() => handleGoogleSelect('sarah@admin.com', 'Sarah Jenkins')}
                  style={googleAccountBtnStyle}
                >
                  <div style={googleAvatarStyle}>S</div>
                  <div>
                    <div style={googleNameStyle}>Sarah Jenkins</div>
                    <div style={googleEmailStyle}>sarah@admin.com</div>
                  </div>
                </button>

                <button
                  onClick={() => handleGoogleSelect('michael@hr.com', 'Michael Chen')}
                  style={googleAccountBtnStyle}
                >
                  <div style={googleAvatarStyle}>M</div>
                  <div>
                    <div style={googleNameStyle}>Michael Chen</div>
                    <div style={googleEmailStyle}>michael@hr.com</div>
                  </div>
                </button>

                <button
                  onClick={() => handleGoogleSelect('john@employee.com', 'John Doe')}
                  style={googleAccountBtnStyle}
                >
                  <div style={googleAvatarStyle}>J</div>
                  <div>
                    <div style={googleNameStyle}>John Doe</div>
                    <div style={googleEmailStyle}>john@employee.com</div>
                  </div>
                </button>

                <button
                  onClick={() => setUseCustomGoogle(true)}
                  style={{ ...googleAccountBtnStyle, borderStyle: 'dashed', justifyContent: 'center' }}
                >
                  <User size={16} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Use another account</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Jane Smith"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Google Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="jane.smith@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => setUseCustomGoogle(false)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

const googleAccountBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.01)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'left',
  color: 'var(--text-primary)',
  transition: 'background 0.2s'
};

const googleAvatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'var(--primary)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '0.9rem'
};

const googleNameStyle = {
  fontSize: '0.8rem',
  fontWeight: '800'
};

const googleEmailStyle = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)'
};

export default Login;
