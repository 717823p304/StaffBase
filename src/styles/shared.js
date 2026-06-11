// Shared layout and component styles used across multiple pages

// Page-level layout container
export const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

// Page header with action buttons on the right
export const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

// Page title text
export const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  color: 'var(--text-primary)'
};

// Page subtitle / description text
export const subtitleStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)'
};

// Responsive grid for cards/panels
export const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem'
};

// Panel card with border
export const panelCardStyle = {
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column'
};

// Panel header with bottom border
export const panelHeaderStyle = {
  padding: '1rem 1.25rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

// Panel title text
export const panelTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: '700'
};

// Two-column form grid
export const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
};

// Vertical form layout
export const formColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

// Empty state text
export const emptyTextStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  textAlign: 'center',
  padding: '2rem 1rem'
};

// Vertical list container
export const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

// List item row with space-between
export const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px'
};

// Item name text in lists
export const itemNameStyle = {
  fontSize: '0.85rem',
  fontWeight: '700'
};

// Item sub-text in lists
export const itemSubStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  marginTop: '1px'
};

// Input field with icon container
export const inputContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

// Input field icon positioning
export const inputIconStyle = {
  position: 'absolute',
  left: '12px',
  color: 'var(--text-muted)'
};

// Two-column workspace split
export const workspaceSplitStyle = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: '1.5rem'
};
