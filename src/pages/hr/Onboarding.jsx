import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { api } from '../../services/api';
import { Compass, CheckCircle, Clock, AlertTriangle, ShieldCheck, UserCheck, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { containerStyle } from '../../styles/shared';

const Onboarding = () => {
  const { employees, confirmEmployeeProbation, addToast } = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/onboarding');
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load onboarding tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await api.put(`/onboarding/${task.id}`, { status: nextStatus });
      if (res.success) {
        fetchTasks();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update task', 'danger');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await api.delete(`/onboarding/${taskId}`);
      if (res.success) {
        addToast('Task deleted successfully.', 'info');
        fetchTasks();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'danger');
    }
  };

  const handleAddTaskSubmit = async (e, empId) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      const res = await api.post('/onboarding', {
        employeeId: empId,
        taskName: newTaskName.trim(),
        status: 'Pending'
      });
      if (res.success) {
        addToast('Onboarding task registered.', 'success');
        setNewTaskName('');
        setShowAddTask(null);
        fetchTasks();
      }
    } catch (err) {
      addToast(err.message || 'Failed to register onboarding task', 'danger');
    }
  };

  // Find employees who joined recently or are in probation
  const onboardingStaff = employees.filter(e => e.status === 'On Probation' || e.status === 'Active');

  return (
    <div style={containerStyle} className="animate-fade-in">
      <PageHeader
        title="Onboarding & Probation Control"
        subtitle="Track equipment provisioning, systems induction checklists, and probation milestones for new hires."
      />

      {/* Renders pipeline tracking board */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading onboarding dashboard...</div>
      ) : onboardingStaff.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No staff currently in onboarding or active directories.</div>
      ) : (
        <div style={pipelineGrid}>
          {onboardingStaff.map((emp) => {
            const isProbation = emp.status === 'On Probation';
            const empTasks = tasks.filter(t => t.employeeId === emp.id);
            const totalTasks = empTasks.length;
            const completedTasks = empTasks.filter(t => t.status === 'Completed').length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            return (
              <div key={emp.id} className="glass-card" style={cardStyle}>
                {/* Card Header */}
                <div style={cardHeaderRow}>
                  <div style={{
                    ...avatarStyle,
                    backgroundColor: emp.bgColor || 'var(--primary)'
                  }}>
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{emp.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.designation} • ID: {emp.id}</span>
                  </div>
                </div>

                {/* Progress metrics */}
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
                    <span>Induction Progress</span>
                    <span>{progress}% ({completedTasks}/{totalTasks})</span>
                  </div>
                  <div style={progressBarContainer}>
                    <div style={{
                      ...progressBarFill,
                      width: `${progress}%`,
                      background: progress === 100 ? 'var(--success)' : 'var(--warning)'
                    }}></div>
                  </div>
                </div>

                {/* Checklist list */}
                <div style={checklistContainer}>
                  {empTasks.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No onboarding checklist items defined.</p>
                  ) : (
                    empTasks.map((task) => (
                      <div key={task.id} style={checklistItem}>
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => handleToggleTask(task)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ flex: 1, textDecoration: task.status === 'Completed' ? 'line-through' : 'none', opacity: task.status === 'Completed' ? 0.6 : 1 }}>
                          {task.taskName}
                        </span>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                          title="Delete Task"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}

                  {/* Add Task Control inline */}
                  {showAddTask === emp.id ? (
                    <form onSubmit={(e) => handleAddTaskSubmit(e, emp.id)} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Task description..."
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        required
                        autoFocus
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Add</button>
                      <button type="button" onClick={() => setShowAddTask(null)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Cancel</button>
                    </form>
                  ) : (
                    <button 
                      onClick={() => { setShowAddTask(emp.id); setNewTaskName(''); }}
                      className="btn btn-secondary" 
                      style={{ marginTop: '6px', padding: '4px 8px', fontSize: '0.7rem', display: 'inline-flex', alignSelf: 'flex-start' }}
                    >
                      <Plus size={10} />
                      <span>Add Checklist Item</span>
                    </button>
                  )}
                </div>

                {/* Confirmation details */}
                <div style={confirmationSection}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Joining: <strong>{emp.dateOfJoining}</strong></span>
                    <span className={`badge badge-${isProbation ? 'warning' : 'success'}`}>{emp.status}</span>
                  </div>
                  {isProbation && (
                    <button
                      onClick={() => confirmEmployeeProbation(emp.id)}
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '1rem', padding: '6px 12px', fontSize: '0.75rem', boxShadow: 'none' }}
                    >
                      Approve Confirmation
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Styling Variables

const pipelineGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem'
};

const cardStyle = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--border-color)'
};

const cardHeaderRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const avatarStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: '800',
  fontSize: '1.1rem'
};

const progressBarContainer = {
  width: '100%',
  height: '6px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '3px',
  overflow: 'hidden',
  marginBottom: '1.25rem'
};

const progressBarFill = {
  height: '100%',
  borderRadius: '3px'
};

const checklistContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '1.25rem',
  marginBottom: '1.25rem'
};

const checklistItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const confirmationSection = {
  marginTop: 'auto'
};

export default Onboarding;
