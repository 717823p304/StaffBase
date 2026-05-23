import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const { loginUser, currentUser, addToast } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (currentUser) {
      window.location.hash = '/dashboard';
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }
    const logged = loginUser(email, password);
    if (logged) {
      window.location.hash = '/dashboard';
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123'); // Preset password
    
    // Auto-login with small delay for visual feedback
    setTimeout(() => {
      const logged = loginUser(demoEmail, 'password123');
      if (logged) {
        window.location.hash = '/dashboard';
      }
    }, 150);
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
                placeholder="name@staffbase.com"
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

        {/* Quick Demo Selector */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '2rem 0 1.25rem 0' }}>
          <span style={{
            position: 'relative',
            background: 'var(--bg-main)',
            padding: '0 12px',
            fontSize: '0.7rem',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Quick Demo Profiles
          </span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-color)', zIndex: -1 }}></div>
        </div>

        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textAlign: 'center', fontWeight: 600 }}>
          Select a role to pre-fill and log in instantly:
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => handleQuickLogin('sarah.jenkins@staffbase.com')}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.01)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <strong style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sarah Jenkins</strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--danger)', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                System Admin Console
              </span>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--danger)' }} />
          </button>

          <button
            onClick={() => handleQuickLogin('michael.chen@staffbase.com')}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.01)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <strong style={{ fontSize: '0.8rem', fontWeight: 700 }}>Michael Chen</strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--warning)', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                HR Operations
              </span>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--warning)' }} />
          </button>

          <button
            onClick={() => handleQuickLogin('john.doe@staffbase.com')}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.01)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <strong style={{ fontSize: '0.8rem', fontWeight: 700 }}>John Doe</strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Senior Software Engineer
              </span>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--primary)' }} />
          </button>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>First time onboarding? </span>
          <a href="#/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Request Profile</a>
        </div>

      </div>
    </div>
  );
};

export default Login;
