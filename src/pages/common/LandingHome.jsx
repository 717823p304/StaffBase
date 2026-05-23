import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import heroWorkingImg from '../../assets/hero_working.png';
import { 
  ShieldCheck, 
  Users, 
  FolderLock, 
  LayoutDashboard, 
  GitBranch, 
  BarChart3, 
  UserCheck, 
  LogIn, 
  LogOut,
  ArrowRight,
  Sparkles,
  Database,
  Mail,
  Phone,
  MapPin,
  Send,
  Key,
  Cpu
} from 'lucide-react';

const LandingHome = () => {
  const { currentUser, addToast, logoutUser } = useContext(AppContext);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (addToast) {
      addToast('Thank you! Your enterprise inquiry has been logged successfully.', 'success');
    }
    e.target.reset();
  };

  const handleScroll = (id) => (e) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Premium Floating Auroras */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>

      {/* Landing Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 3rem',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="sidebar-logo-badge">SB</div>
          <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Staff<span style={{ color: 'var(--primary)' }}>Base</span>
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="landing-nav">
          <a 
            href="#features-section" 
            onClick={handleScroll('features-section')}
            style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}
          >
            Features
          </a>
          <a 
            href="#security-section" 
            onClick={handleScroll('security-section')}
            style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}
          >
            Trust & Security
          </a>
          <a 
            href="#contact-section" 
            onClick={handleScroll('contact-section')}
            style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}
          >
            Contact Details
          </a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {currentUser ? (
            <>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Active: <span style={{ color: 'var(--primary)' }}>{currentUser.name}</span>
              </span>
              <a href="#/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem' }}>
                <span>Enter Workspace</span>
                <ArrowRight size={15} />
              </a>
              <button 
                onClick={logoutUser} 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <a href="#/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogIn size={15} />
                <span>Login</span>
              </a>
              <a href="#/register" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Register</span>
                <ArrowRight size={15} />
              </a>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 2rem 4rem 2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center'
      }}>
        <div>
          <div className="badge badge-info" style={{ marginBottom: '1.5rem' }}>
            <Sparkles size={14} style={{ marginRight: '6px' }} />
            <span>Next-Generation HR Core Engine</span>
          </div>
          
          <h1 style={{
            fontSize: '3.2rem',
            lineHeight: '1.15',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            letterSpacing: '-1px'
          }}>
            The Unified Hub for <br />
            <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Staff Operations
            </span>
          </h1>
          
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '2.25rem'
          }}>
            Unify employee profiles, secure document vault compliance, interactive department hierarchies, 
            and automated multi-step onboarding under a sleek, highly professional Glassmorphic dashboard.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {currentUser ? (
              <>
                <a href="#/dashboard" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Go to Dashboard</span>
                  <ArrowRight size={16} />
                </a>
                <button 
                  onClick={logoutUser} 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <LogOut size={16} />
                  <span>Logout Session</span>
                </button>
              </>
            ) : (
            <>
                <a href="#/login" className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Login</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#/register" className="btn btn-secondary" style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem' }}>
                  <span>Register</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Real-world Working Person Image with Floating Glassmorphic Widgets */}
        <div style={{ position: 'relative', width: '100%', height: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Main Hero Frame containing the high-fidelity working professionals image */}
          <div className="glass-card" style={{ 
            width: '90%', 
            height: '100%', 
            padding: 0, 
            overflow: 'hidden', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-premium)',
            background: 'var(--bg-card)'
          }}>
            <img 
              src={heroWorkingImg} 
              alt="Real World Corporate Professionals collaborating" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          {/* Floating Glassmorphic Stats Card 1 (Top Left) */}
          <div className="glass-card animate-float" style={{
            position: 'absolute',
            top: '25px',
            left: '-10px',
            padding: '0.85rem 1.25rem',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-hover)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#fff' }}>
              SB Core Engine Online
            </span>
          </div>

          {/* Floating Glassmorphic Stats Card 2 (Bottom Right) */}
          <div className="glass-card" style={{
            position: 'absolute',
            bottom: '20px',
            right: '-10px',
            padding: '1.25rem 1.5rem',
            width: '270px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-premium)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>Staff Operations</span>
              <span className="badge badge-success">Active</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>128 <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Members</span></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Vault Verification Compliance: <strong>98.4%</strong></div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features-section" style={{
        maxWidth: '1200px',
        margin: '4rem auto 0 auto',
        padding: '0 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Engineered for Modern Enterprise Hubs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            Six core modules built directly inside StaffBase to streamline workspace operations and secure employee directories.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* Card 1 */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'var(--primary-glow)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '1.25rem'
            }}>
              <LayoutDashboard size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Unified Personal Dashboards</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Dual-mode operations. Staff view schedules, milestones, and details, while HR administrators switch on-the-fly to manage headcount metrics.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'var(--secondary-glow)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              marginBottom: '1.25rem'
            }}>
              <FolderLock size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Secure Documents Vault</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Inspect critical clearances and tax certifications securely. Full drag-and-drop file simulator with proactive expiry alerts and status flags.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'var(--accent-glow)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              marginBottom: '1.25rem'
            }}>
              <GitBranch size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Interactive Org Chart</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Visualize direct reports and department trees dynamically. Filter by divisions and inspect parent hierarchies in a highly visual tree structure.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'var(--warning-glow)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning)',
              marginBottom: '1.25rem'
            }}>
              <UserCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Multi-Step HR Wizard</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Add and provision new employees seamlessly via a state-guided wizard. Validates credentials, sets roles, and triggers immediate onboarding milestones.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'var(--primary-glow)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '1.25rem'
            }}>
              <BarChart3 size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Interactive Analytics</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Examine department percentages, payroll allocations, and confirm status curves using reactive, high-contrast visual SVG charts.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'var(--secondary-glow)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              marginBottom: '1.25rem'
            }}>
              <Database size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Audit Activity Ledger</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Strict regulatory transparency. Auto-logs all employee additions, document verifications, role revisions, and records updates in a chronological ledger.
            </p>
          </div>

          {/* Card 7 */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'var(--primary-glow)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '1.25rem'
            }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Smart Onboarding Journeys</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Standardize employee preparation pathways. Monitor dynamic milestone completions from contract signatures to final hardware distribution.
            </p>
          </div>

          {/* Card 8 */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'var(--warning-glow)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning)',
              marginBottom: '1.25rem'
            }}>
              <Key size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Granular RBAC Policies</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Protect internal parameters. Granular role-based access restricts views dynamically based on admin, management, or standard personnel profiles.
            </p>
          </div>
        </div>
      </section>

      {/* Security CTA Section */}
      <section id="security-section" style={{
        maxWidth: '1200px',
        margin: '5rem auto 0 auto',
        padding: '0 2rem'
      }}>
        <div className="glass-card" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
            marginBottom: '0.5rem'
          }}>
            <ShieldCheck size={42} />
          </div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Bank-Grade Secure Compliance
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '650px', lineHeight: '1.6' }}>
            All operations, documents, and credentials are fully isolated via active session controls, custom encryption tags, 
            and granular workspace role permissions. Evaluation mode sandbox is fully self-contained.
          </p>
          <a href="#/login" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.8rem 2rem' }}>
            <span>Initialize Secure Login Session</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Contact & Inquiries Section */}
      <section id="contact-section" style={{
        maxWidth: '1200px',
        margin: '5rem auto 0 auto',
        padding: '0 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Get in Touch with StaffBase
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            Have questions about enterprise deployment, licensing, or compliance parameters? Our support division is available 24/7.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'start'
        }} className="contact-grid">
          
          {/* Left Side: Contact Information Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card 1: Corporate HQ */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                background: 'var(--primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>Corporate Headquarters</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>StaffBase Plaza, Suite 400, San Francisco, CA 94107</p>
              </div>
            </div>

            {/* Card 2: Enterprise Hotline */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                background: 'var(--secondary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--secondary)'
              }}>
                <Phone size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>Enterprise Hotline</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>+1 (800) 555-BASE (2273) • Mon - Fri, 8 AM - 6 PM PST</p>
              </div>
            </div>

            {/* Card 3: Email Channels */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                background: 'var(--accent-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}>
                <Mail size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>Official Email Enquiries</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>corporate@staffbase-internal.net • support@staffbase-internal.net</p>
              </div>
            </div>
          </div>

          {/* Right Side: Glassmorphic Callback Request Form */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Send a Direct Message</h3>
            
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="e.g. John Miller" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Company Email</label>
                <input type="email" className="form-input" placeholder="e.g. j.miller@enterprise.com" required />
              </div>

              <div className="form-group">
                <label className="form-label">How can we help you?</label>
                <textarea className="form-textarea" rows="4" placeholder="Briefly describe your requirements or inquiry details..." style={{ resize: 'none' }} required></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}>
                <Send size={15} />
                <span>Submit Secure Inquiry</span>
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingHome;
