import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Grid, List, Mail, Eye, Calendar, MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { containerStyle } from '../../styles/shared';

const EmployeeDirectory = () => {
  const { employees, departments } = useContext(AppContext);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid | list

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter Employees Logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.skills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Paginated Employees
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      
      <PageHeader
        title="Employee Directory"
        subtitle="Browse and search profiles, contact details, and department registries."
      >
        <div style={viewControls}>
          <button
            onClick={() => setViewMode('grid')}
            style={viewMode === 'grid' ? activeViewBtn : viewBtn}
            title="Grid View"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={viewMode === 'list' ? activeViewBtn : viewBtn}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </PageHeader>

      {/* Search & Filter Toolbar */}
      <div className="glass-card" style={toolbarCardStyle}>
        <div style={toolbarGrid}>
          {/* Text Search */}
          <div style={searchFieldStyle}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search by name, title, skill tags..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Department Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <select
              className="form-select"
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Probation">On Probation</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          {/* Clear Button */}
          {(searchTerm || selectedDept !== 'all' || selectedStatus !== 'all') && (
            <button onClick={handleClearFilters} className="btn btn-secondary" style={clearFiltersBtn}>
              <X size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Grid/List Results */}
      {paginatedEmployees.length === 0 ? (
        <div className="glass-card" style={emptyCardStyle}>
          <h2>No matching profiles found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Try refining your keyword query or expanding the status parameters.
          </p>
          <button onClick={handleClearFilters} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            Clear Search Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div style={directoryGridStyle}>
          {paginatedEmployees.map((emp) => (
            <div key={emp.id} className="glass-card" style={gridCardStyle}>
              {/* Profile Card Head */}
              <div style={cardHeaderRow}>
                <div style={{
                  ...avatarStyle,
                  backgroundColor: emp.bgColor || 'var(--primary)'
                }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={headerTextWrapper}>
                  <h3 style={empNameText}>{emp.name}</h3>
                  <span style={empTitleText}>{emp.designation}</span>
                </div>
              </div>

              {/* Status & Dept Metadata */}
              <div style={metadataGrid}>
                <div style={metaItem}>
                  <span style={metaLabel}>Department</span>
                  <span style={metaValue}>{emp.department}</span>
                </div>
                <div style={metaItem}>
                  <span style={metaLabel}>Status</span>
                  <span className={`badge badge-${emp.status === 'Active' ? 'success' : emp.status === 'On Probation' ? 'warning' : 'danger'}`} style={{ marginTop: '2px' }}>
                    {emp.status}
                  </span>
                </div>
              </div>

              <div style={detailsDivider}></div>

              {/* Joined Date & Email */}
              <div style={infoListStyle}>
                <div style={infoLineStyle}>
                  <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>Joined {emp.dateOfJoining}</span>
                </div>
                <div style={infoLineStyle}>
                  <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                  <a href={`mailto:${emp.email}`} style={emailLinkStyle}>{emp.email}</a>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={cardFooterActions}>
                <a href={`#/profile/${emp.id}`} className="btn btn-secondary" style={footerBtnStyle}>
                  <Eye size={14} />
                  <span>View Details</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="table-container animate-fade-in">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Date of Joining</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        ...smallAvatarStyle,
                        backgroundColor: emp.bgColor || 'var(--primary)'
                      }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.9rem' }}>{emp.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>
                    <span className={`badge badge-${emp.status === 'Active' ? 'success' : emp.status === 'On Probation' ? 'warning' : 'danger'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>{emp.dateOfJoining}</td>
                  <td>
                    <a href={`mailto:${emp.email}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{emp.email}</a>
                  </td>
                  <td>
                    <a href={`#/profile/${emp.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                      <Eye size={12} />
                      <span>Details</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={paginationWrapper}>
          <span style={paginationText}>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees</span>
          <div style={pageActionGrid}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={currentPage === 1 ? disabledPageBtn : pageBtn}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                style={currentPage === idx + 1 ? activePageBtn : pageBtn}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={currentPage === totalPages ? disabledPageBtn : pageBtn}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// Styling Variables

const viewControls = {
  display: 'flex',
  gap: '4px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '4px'
};

const viewBtn = {
  background: 'none',
  border: 'none',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  borderRadius: '6px',
  transition: 'all 0.2s'
};

const activeViewBtn = {
  ...viewBtn,
  background: 'var(--primary-glow)',
  color: 'var(--primary)'
};

const toolbarCardStyle = {
  padding: '1rem 1.25rem'
};

const toolbarGrid = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'center'
};

const searchFieldStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  minWidth: '240px'
};

const searchIcon = {
  position: 'absolute',
  left: '12px',
  color: 'var(--text-muted)'
};

const clearFiltersBtn = {
  padding: '0.625rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.85rem'
};

const directoryGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem'
};

const gridCardStyle = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.25s',
  ':hover': {
    transform: 'translateY(-3px)'
  }
};

const cardHeaderRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
};

const avatarStyle = {
  width: '54px',
  height: '54px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: '800',
  fontSize: '1.35rem',
  boxShadow: 'var(--shadow-glow)'
};

const smallAvatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: '700',
  fontSize: '0.85rem'
};

const headerTextWrapper = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left'
};

const empNameText = {
  fontSize: '1.05rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  letterSpacing: '-0.3px'
};

const empTitleText = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: '500',
  marginTop: '2px'
};

const metadataGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginTop: '1.25rem'
};

const metaItem = {
  display: 'flex',
  flexDirection: 'column'
};

const metaLabel = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  fontWeight: '600'
};

const metaValue = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  fontWeight: '700',
  marginTop: '2px'
};

const detailsDivider = {
  height: '1px',
  backgroundColor: 'var(--border-color)',
  margin: '1.25rem 0'
};

const infoListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const infoLineStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.75rem',
  color: 'var(--text-secondary)'
};

const emailLinkStyle = {
  color: 'var(--primary)',
  textDecoration: 'underline',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px'
};

const cardFooterActions = {
  marginTop: '1.5rem',
  display: 'flex',
  gap: '6px'
};

const footerBtnStyle = {
  flex: 1,
  padding: '8px 12px',
  fontSize: '0.8rem',
  justifyContent: 'center'
};

const emptyCardStyle = {
  padding: '4rem 2rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

// Pagination Wrapper
const paginationWrapper = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 0',
  borderTop: '1px solid var(--border-color)',
  marginTop: '1rem',
  flexWrap: 'wrap',
  gap: '12px'
};

const paginationText = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)'
};

const pageActionGrid = {
  display: 'flex',
  gap: '4px'
};

const pageBtn = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  transition: 'all 0.2s',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.08)'
  }
};

const activePageBtn = {
  ...pageBtn,
  background: 'var(--primary-glow)',
  borderColor: 'var(--primary)',
  color: 'var(--primary)'
};

const disabledPageBtn = {
  ...pageBtn,
  opacity: 0.3,
  cursor: 'not-allowed',
  pointerEvents: 'none'
};

export default EmployeeDirectory;
