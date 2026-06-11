// Shared styles for authentication pages (Login, Register, ForgotPassword, ResetPassword, etc.)

export const authPageStyle = {
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-deep)',
  padding: '1.5rem',
  color: 'var(--text-primary)'
};

export const authCardStyle = {
  maxWidth: '400px',
  width: '100%',
  padding: '2rem'
};

export const authTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  marginBottom: '0.5rem'
};

export const authSubtextStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.4'
};

export const authBackLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  marginTop: '1.5rem',
  fontWeight: '700'
};

export const authInputContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

export const authInputIconStyle = {
  position: 'absolute',
  left: '12px',
  color: 'var(--text-muted)'
};

export const authErrorStyle = {
  marginTop: '1rem',
  padding: '0.75rem',
  background: 'var(--danger-glow)',
  color: 'var(--danger)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: 600
};

export const authIconBadgeStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: 'var(--primary-glow)',
  color: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem auto'
};
