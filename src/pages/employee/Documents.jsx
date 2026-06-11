import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { api } from '../../services/api';
import { UploadCloud, FileText, AlertTriangle, CheckCircle2, ShieldCheck, Download, Trash2, Calendar } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { containerStyle } from '../../styles/shared';
import { downloadFile } from '../../utils/downloadFile';

const Documents = () => {
  const { currentUser, employees, uploadEmployeeDocument, addToast } = useContext(AppContext);
  const fileInputRef = useRef(null);

  // Grab the fresh copy of employee data from context to reflect newly uploaded documents
  const emp = employees.find(e => e.id === currentUser.id) || currentUser;

  const [documentsList, setDocumentsList] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Passport Copy');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [expiryDate, setExpiryDate] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch documents on load
  const fetchDocs = async () => {
    try {
      const res = await api.get(`/documents/my-documents?employeeId=${emp.id}`);
      if (res.success) {
        setDocumentsList(res.data);
      }
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [emp.id]);

  // Check if any documents are expiring soon
  const expiringDocs = documentsList.filter(doc => {
    if (doc.expiryDate && doc.expiryDate !== 'N/A') {
      const exp = new Date(doc.expiryDate);
      const today = new Date('2026-05-20');
      const diff = exp - today;
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 45;
    }
    return false;
  });

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      // Auto-fill file name if empty
      setDocName(file.name.split('.')[0]);
      
      // Auto-fill format extension
      const ext = file.name.split('.').pop().toUpperCase();
      if (ext === 'PDF') setFileFormat('PDF');
      else if (['JPG', 'JPEG', 'PNG'].includes(ext)) setFileFormat('Image');
      else if (['DOC', 'DOCX'].includes(ext)) setFileFormat('Word');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!docName.trim()) {
      addToast('Please specify a document name.', 'warning');
      return;
    }
    if (!selectedFile) {
      addToast('Please select a document file to upload.', 'warning');
      return;
    }
    
    const success = await uploadEmployeeDocument(
      emp.dbId || emp.id,
      `${docType} - ${docName.trim()}`,
      fileFormat,
      expiryDate ? expiryDate : 'N/A',
      selectedFile
    );

    if (success) {
      // Reset inputs
      setDocName('');
      setExpiryDate('');
      setSelectedFile(null);
      fetchDocs(); // reload files
    }
  };

  const handleDownload = async (doc) => {
    try {
      await downloadFile(`/documents/${doc.id}`, `${doc.name}.${doc.type.toLowerCase()}`);
      addToast(`Downloaded: ${doc.name}`, 'success');
    } catch (err) {
      addToast('Failed to download document: ' + err.message, 'danger');
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document from the vault?')) {
      try {
        const res = await api.delete(`/documents/${docId}`);
        if (res.success) {
          addToast('Document deleted successfully.', 'success');
          setDocumentsList(prev => prev.filter(d => d.id !== docId));
        }
      } catch (err) {
        addToast(err.message || 'Failed to delete document', 'danger');
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
      addToast(`Detected file "${e.dataTransfer.files[0].name}"! Now click Submit.`, 'info');
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <PageHeader
        title="Document Vault & Management"
        subtitle="Securely upload, store, and verify employment forms, certifications, and identification records."
      />

      {/* Warnings & Expirations */}
      {expiringDocs.length > 0 && (
        <div style={alertCardStyle}>
          <AlertTriangle size={20} />
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Document Expiry Alert:</strong>
            <p style={{ fontSize: '0.8rem', marginTop: '2px', opacity: 0.9 }}>
              You have {expiringDocs.length} document(s) expiring within 45 days. Please upload updated renewals immediately to avoid clearance lockouts.
            </p>
          </div>
        </div>
      )}

      {/* Workspace Splitter */}
      <div style={workspaceGrid}>
        
        {/* Panel Left: Upload Form Widget */}
        <div className="glass-card" style={panelCardStyle}>
          <div style={panelHeaderStyle}>
            <h2 style={panelTitleStyle}>Upload Corporate Documents</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <form onSubmit={handleUploadSubmit}>
              
              {/* Drag-Drop simulated dropzone */}
              <div
                style={dragActive ? activeDropZoneStyle : dropZoneStyle}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                />
                <UploadCloud size={36} style={{ color: selectedFile || dragActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                <h3>{selectedFile ? 'File Selected' : 'Choose Document File'}</h3>
                <p>{selectedFile ? `"${selectedFile.name}"` : 'Drag files here or click to browse corporate folders.'}</p>
                <span style={fileSupportLabel}>Supports PDF, DOCX, PNG, JPG up to 5MB</span>
              </div>

              <div style={formGrid}>
                <div className="form-group">
                  <label className="form-label">Document Category</label>
                  <select
                    className="form-select"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="Passport Copy">Passport Copy</option>
                    <option value="Driver License">Driver License Copy</option>
                    <option value="Work Permit Visa">Work Permit Visa</option>
                    <option value="W-4 Tax Form">W-4 Tax Form</option>
                    <option value="Offer Letter">Offer Letter</option>
                    <option value="NDA Agreement">NDA Agreement</option>
                    <option value="Certification Page">Educational Certifications</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">File Name Identifier</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., JohnDoe_Passport_2026"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Format</label>
                  <select
                    className="form-select"
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                  >
                    <option value="PDF">PDF Sheet</option>
                    <option value="Image">JPG/PNG Image</option>
                    <option value="Word">DOCX Word File</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date (If applicable)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                <UploadCloud size={16} />
                <span>Submit File for HR Review</span>
              </button>

            </form>
          </div>
        </div>

        {/* Panel Right: Vault List */}
        <div className="glass-card" style={panelCardStyle}>
          <div style={panelHeaderStyle}>
            <h2 style={panelTitleStyle}>Your Secure Documents Vault</h2>
            <span className="badge badge-info">{documentsList.length} Files</span>
          </div>
          <div style={{ padding: '1.25rem' }}>
            {loadingDocs ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading documents...</div>
            ) : documentsList.length === 0 ? (
              <div style={emptyVaultStyle}>
                <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                <h3>Vault Empty</h3>
                <p>No documents uploaded yet. Start by using the uploader form on the left.</p>
              </div>
            ) : (
              <div style={vaultFileList}>
                {documentsList.map((doc) => (
                  <div key={doc.id} style={docCardStyle} className="glass-card">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={docIconWrapper}>
                        <FileText size={20} />
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <h4 style={docTitleText}>{doc.name}</h4>
                        <div style={docMetaList}>
                          <span style={docMetaItem}>Type: {doc.type}</span>
                          <span style={docMetaItem}>• Uploaded: {doc.dateUploaded}</span>
                        </div>
                        {doc.expiryDate && doc.expiryDate !== 'N/A' && (
                          <div style={docExpiryStyle}>
                            <Calendar size={12} />
                            <span>Expires: {doc.expiryDate}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span className={`badge badge-${doc.status === 'Verified' ? 'success' : doc.status === 'Pending' ? 'warning' : 'danger'}`}>
                          {doc.status}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleDownload(doc)}
                            style={actionBtnStyle}
                            title="Download Copy"
                          >
                            <Download size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            style={{ ...actionBtnStyle, color: 'var(--danger)' }}
                            title="Delete Copy"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Styling Variables

const alertCardStyle = {
  padding: '1rem 1.25rem',
  borderRadius: '10px',
  background: 'var(--warning-glow)',
  color: 'var(--warning)',
  border: '1px solid rgba(245, 158, 11, 0.2)',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  textAlign: 'left'
};

const workspaceGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.5rem'
};

const panelCardStyle = {
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column'
};

const panelHeaderStyle = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const panelTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const dropZoneStyle = {
  padding: '2rem 1.5rem',
  border: '2px dashed var(--border-color)',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.01)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  textAlign: 'center',
  marginBottom: '1.5rem',
  ':hover': {
    borderColor: 'var(--primary)',
    background: 'var(--primary-glow)'
  }
};

const activeDropZoneStyle = {
  ...dropZoneStyle,
  borderColor: 'var(--primary)',
  background: 'var(--primary-glow)'
};

const fileSupportLabel = {
  fontSize: '0.675rem',
  color: 'var(--text-muted)'
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px'
};

const emptyVaultStyle = {
  padding: '4rem 1.5rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  color: 'var(--text-muted)'
};

const vaultFileList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const docCardStyle = {
  padding: '12px',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px'
};

const docIconWrapper = {
  width: '36px',
  height: '36px',
  borderRadius: '6px',
  background: 'rgba(255, 255, 255, 0.04)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--primary)'
};

const docTitleText = {
  fontSize: '0.85rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const docMetaList = {
  display: 'flex',
  gap: '6px',
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  marginTop: '2px'
};

const docMetaItem = {};

const docExpiryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.7rem',
  color: 'var(--warning)',
  marginTop: '4px',
  fontWeight: '600'
};

const actionBtnStyle = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid var(--border-color)',
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  ':hover': {
    color: 'var(--primary)',
    background: 'var(--primary-glow)'
  }
};

export default Documents;
