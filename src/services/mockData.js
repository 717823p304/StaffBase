// StaffBase Rich Mock Database

export const DEFAULT_DEPARTMENTS = [
  { id: 'dept-1', name: 'Engineering', code: 'ENG', manager: 'Michael Chen' },
  { id: 'dept-2', name: 'Human Resources', code: 'HR', manager: 'Sarah Jenkins' },
  { id: 'dept-3', name: 'Product & Design', code: 'PD', manager: 'Amanda Ross' },
  { id: 'dept-4', name: 'Marketing & Sales', code: 'MKT', manager: 'David Sterling' },
  { id: 'dept-5', name: 'Finance', code: 'FIN', manager: 'Elena Rostova' }
];

export const DEFAULT_DESIGNATIONS = [
  { id: 'desg-1', name: 'Software Engineer', department: 'Engineering' },
  { id: 'desg-2', name: 'Senior Software Engineer', department: 'Engineering' },
  { id: 'desg-3', name: 'Engineering Lead', department: 'Engineering' },
  { id: 'desg-4', name: 'HR Generalist', department: 'Human Resources' },
  { id: 'desg-5', name: 'HR Manager', department: 'Human Resources' },
  { id: 'desg-6', name: 'Product Designer', department: 'Product & Design' },
  { id: 'desg-7', name: 'Lead UI/UX Designer', department: 'Product & Design' },
  { id: 'desg-8', name: 'Marketing Executive', department: 'Marketing & Sales' },
  { id: 'desg-9', name: 'Financial Controller', department: 'Finance' }
];

export const MOCK_EMPLOYEES = [
  {
    id: 'EMP-101',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@staffbase.com',
    role: 'Admin',
    department: 'Human Resources',
    designation: 'Director of HR & Operations',
    status: 'Active',
    dateOfJoining: '2021-03-15',
    profilePic: null,
    bgColor: '#ec4899', // Pink
    bio: 'Experienced HR director with a passion for building inclusive company cultures and scalable team operations.',
    skills: ['Strategic HR', 'Conflict Resolution', 'Budgeting', 'Recruitment', 'Employment Law'],
    emergencyContacts: [
      { name: 'Charles Jenkins', relationship: 'Spouse', phone: '+1 (555) 234-5678', email: 'c.jenkins@gmail.com' }
    ],
    bankingInfo: {
      bankName: 'Apex Capital Bank',
      accountName: 'Sarah Jenkins',
      accountNumber: '•••• •••• •••• 9812',
      ifscCode: 'APEX0001092',
      salary: 125000
    },
    timeline: [
      { date: '2021-03-15', title: 'Joined StaffBase', desc: 'Hired as HR Lead.' },
      { date: '2021-09-15', title: 'Completed Probation', desc: 'Confirmed with an excellent rating.' },
      { date: '2023-01-01', title: 'Promotion', desc: 'Promoted to Director of HR & Operations.' }
    ],
    documents: [
      { id: 'doc-101-1', name: 'Employment Offer Letter', type: 'PDF', status: 'Verified', dateUploaded: '2021-03-10', expiryDate: 'N/A' },
      { id: 'doc-101-2', name: 'Passport Copy', type: 'Image', status: 'Verified', dateUploaded: '2021-03-10', expiryDate: '2030-05-12' },
      { id: 'doc-101-3', name: 'Background Verification Report', type: 'PDF', status: 'Verified', dateUploaded: '2021-03-20', expiryDate: 'N/A' }
    ]
  },
  {
    id: 'EMP-102',
    name: 'Michael Chen',
    email: 'michael.chen@staffbase.com',
    role: 'HR Manager',
    department: 'Human Resources',
    designation: 'HR Manager',
    status: 'Active',
    dateOfJoining: '2022-05-10',
    profilePic: null,
    bgColor: '#e0a927', // Honey Gold
    bio: 'HR Manager specialized in tech talent acquisition, onboarding pipelines, and employee engagement strategies.',
    skills: ['Talent Acquisition', 'Onboarding', 'Performance Reviews', 'Excel', 'Coaching'],
    emergencyContacts: [
      { name: 'Lily Chen', relationship: 'Sister', phone: '+1 (555) 987-6543', email: 'l.chen@gmail.com' }
    ],
    bankingInfo: {
      bankName: 'Fidelity Union',
      accountName: 'Michael Chen',
      accountNumber: '•••• •••• •••• 3415',
      ifscCode: 'FIDU0000451',
      salary: 95000
    },
    timeline: [
      { date: '2022-05-10', title: 'Joined StaffBase', desc: 'Appointed as HR Specialist.' },
      { date: '2022-11-10', title: 'Completed Probation', desc: 'Onboarded fully to global workforce systems.' },
      { date: '2024-04-01', title: 'Promotion', desc: 'Promoted to HR Manager, leading employee experience.' }
    ],
    documents: [
      { id: 'doc-102-1', name: 'Offer Letter', type: 'PDF', status: 'Verified', dateUploaded: '2022-05-05', expiryDate: 'N/A' },
      { id: 'doc-102-2', name: 'Health Insurance Waiver', type: 'PDF', status: 'Verified', dateUploaded: '2022-05-12', expiryDate: '2027-05-12' },
      { id: 'doc-102-3', name: 'W-4 Tax Form', type: 'PDF', status: 'Verified', dateUploaded: '2022-05-15', expiryDate: 'N/A' }
    ]
  },
  {
    id: 'EMP-103',
    name: 'John Doe',
    email: 'john.doe@staffbase.com',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    status: 'Active',
    dateOfJoining: '2023-01-10',
    profilePic: null,
    bgColor: '#10b981', // Emerald
    bio: 'Passionate frontend engineer focused on writing clean, high-performance, accessible React applications.',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Webpack', 'Jest', 'Git'],
    emergencyContacts: [
      { name: 'Jane Doe', relationship: 'Mother', phone: '+1 (555) 456-7890', email: 'jane.doe@gmail.com' }
    ],
    bankingInfo: {
      bankName: 'Global Vault Bank',
      accountName: 'John Doe',
      accountNumber: '•••• •••• •••• 1290',
      ifscCode: 'GLVB0004509',
      salary: 110000
    },
    timeline: [
      { date: '2023-01-10', title: 'Joined StaffBase', desc: 'Started as Senior Software Engineer.' },
      { date: '2023-07-10', title: 'Completed Probation', desc: 'Received maximum score on engineering review.' },
      { date: '2024-02-15', title: 'Skill Badge Awarded', desc: 'Certified in System Architecture by technical council.' }
    ],
    documents: [
      { id: 'doc-103-1', name: 'Employment Contract', type: 'PDF', status: 'Verified', dateUploaded: '2023-01-08', expiryDate: 'N/A' },
      { id: 'doc-103-2', name: 'Driver License Copy', type: 'Image', status: 'Pending', dateUploaded: '2026-05-10', expiryDate: '2027-11-14' }, // Pending
      { id: 'doc-103-3', name: 'Work Permit Visa', type: 'PDF', status: 'Verified', dateUploaded: '2023-01-05', expiryDate: '2026-06-25' } // Expiring soon!
    ]
  },
  {
    id: 'EMP-104',
    name: 'Amanda Ross',
    email: 'amanda.ross@staffbase.com',
    role: 'Employee',
    department: 'Product & Design',
    designation: 'Lead UI/UX Designer',
    status: 'Active',
    dateOfJoining: '2022-09-01',
    profilePic: null,
    bgColor: '#a855f7', // Purple
    bio: 'Lead designer who loves crafting fluid, micro-interaction rich, user-centered design languages and component systems.',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'HTML/CSS'],
    emergencyContacts: [
      { name: 'Robert Ross', relationship: 'Father', phone: '+1 (555) 765-4321', email: 'rob.ross@design.com' }
    ],
    bankingInfo: {
      bankName: 'Summit Trust Bank',
      accountName: 'Amanda Ross',
      accountNumber: '•••• •••• •••• 5642',
      ifscCode: 'SUMM0002102',
      salary: 105000
    },
    timeline: [
      { date: '2022-09-01', title: 'Onboarded', desc: 'Began as Senior UX Designer.' },
      { date: '2023-03-01', title: 'Probation Cleared', desc: 'Standardized design system workflow company-wide.' },
      { date: '2024-06-01', title: 'Promotion', desc: 'Promoted to Lead UI/UX Designer.' }
    ],
    documents: [
      { id: 'doc-104-1', name: 'Employment Offer Letter', type: 'PDF', status: 'Verified', dateUploaded: '2022-08-25', expiryDate: 'N/A' },
      { id: 'doc-104-2', name: 'NDA Agreement', type: 'PDF', status: 'Verified', dateUploaded: '2022-09-01', expiryDate: 'N/A' }
    ]
  },
  {
    id: 'EMP-105',
    name: 'Robert Vance',
    email: 'robert.vance@staffbase.com',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Software Engineer',
    status: 'On Probation',
    dateOfJoining: '2026-03-01',
    profilePic: null,
    bgColor: '#f59e0b', // Amber (matches On Probation)
    bio: 'Enthusiastic full stack junior engineer eager to dive deep into backend performance optimizations and API development.',
    skills: ['Node.js', 'Express', 'SQL', 'Git', 'REST APIs'],
    emergencyContacts: [
      { name: 'Leon Vance', relationship: 'Brother', phone: '+1 (555) 321-7890', email: 'leon.vance@hotmail.com' }
    ],
    bankingInfo: {
      bankName: 'Apex Capital Bank',
      accountName: 'Robert Vance',
      accountNumber: '•••• •••• •••• 7713',
      ifscCode: 'APEX0001092',
      salary: 75000
    },
    timeline: [
      { date: '2026-03-01', title: 'Joined StaffBase', desc: 'Hired into the Engineering core team.' }
    ],
    documents: [
      { id: 'doc-105-1', name: 'Offer Letter', type: 'PDF', status: 'Verified', dateUploaded: '2026-02-20', expiryDate: 'N/A' },
      { id: 'doc-105-2', name: 'Educational Certifications', type: 'PDF', status: 'Pending', dateUploaded: '2026-03-02', expiryDate: 'N/A' }
    ]
  },
  {
    id: 'EMP-106',
    name: 'Elena Rostova',
    email: 'elena.rostova@staffbase.com',
    role: 'Employee',
    department: 'Finance',
    designation: 'Financial Controller',
    status: 'Active',
    dateOfJoining: '2023-11-15',
    profilePic: null,
    bgColor: '#a18262', // Warm Bronze Taupe
    bio: 'Dedicated CPA with 8+ years overseeing corporate audits, cash flow projections, and employee payroll distribution.',
    skills: ['Financial Analysis', 'Auditing', 'CPA', 'Payroll Management', 'Risk Assessment'],
    emergencyContacts: [
      { name: 'Sergei Rostov', relationship: 'Father', phone: '+1 (555) 789-0123', email: 's.rostov@fin.ru' }
    ],
    bankingInfo: {
      bankName: 'Swiss Federal Bank',
      accountName: 'Elena Rostova',
      accountNumber: '•••• •••• •••• 9012',
      ifscCode: 'SWIS0009182',
      salary: 100000
    },
    timeline: [
      { date: '2023-11-15', title: 'Joined StaffBase', desc: 'Began managing Finance operations.' },
      { date: '2024-05-15', title: 'Probation Cleared', desc: 'Overhauled cost efficiency structures.' }
    ],
    documents: [
      { id: 'doc-106-1', name: 'Employment Agreement', type: 'PDF', status: 'Verified', dateUploaded: '2023-11-10', expiryDate: 'N/A' },
      { id: 'doc-106-2', name: 'Tax Identification Declaration', type: 'PDF', status: 'Verified', dateUploaded: '2023-11-16', expiryDate: 'N/A' }
    ]
  },
  {
    id: 'EMP-107',
    name: 'David Sterling',
    email: 'david.sterling@staffbase.com',
    role: 'Employee',
    department: 'Marketing & Sales',
    designation: 'Marketing Executive',
    status: 'Active',
    dateOfJoining: '2024-02-01',
    profilePic: null,
    bgColor: '#10b981', // Emerald
    bio: 'Campaign strategist passionate about digital ads, analytics attribution, brand positioning, and customer relations.',
    skills: ['Digital Marketing', 'SEO', 'Google Analytics', 'Copywriting', 'AdWords'],
    emergencyContacts: [
      { name: 'Martha Sterling', relationship: 'Mother', phone: '+1 (555) 901-2345', email: 'm.sterling@aol.com' }
    ],
    bankingInfo: {
      bankName: 'Global Vault Bank',
      accountName: 'David Sterling',
      accountNumber: '•••• •••• •••• 8831',
      ifscCode: 'GLVB0004509',
      salary: 80000
    },
    timeline: [
      { date: '2024-02-01', title: 'Joined StaffBase', desc: 'Assumed global marketing operations.' }
    ],
    documents: [
      { id: 'doc-107-1', name: 'Employment Contract', type: 'PDF', status: 'Verified', dateUploaded: '2024-01-25', expiryDate: 'N/A' }
    ]
  },
  {
    id: 'EMP-108',
    name: 'Liam Neeson',
    email: 'liam.neeson@staffbase.com',
    role: 'Employee',
    department: 'Security',
    designation: 'Security Consultant',
    status: 'On Leave',
    dateOfJoining: '2022-02-22',
    profilePic: null,
    bgColor: '#64748b', // Slate Gray
    bio: 'Specialized agent focused on data security, access control systems, and internal corporate risk mitigations.',
    skills: ['Risk Assessment', 'Access Control', 'Cybersecurity', 'Incident Response'],
    emergencyContacts: [
      { name: 'Bryan Mills', relationship: 'Colleague', phone: '+1 (555) 911-0911', email: 'bryan.mills@cia.gov' }
    ],
    bankingInfo: {
      bankName: 'Apex Capital Bank',
      accountName: 'Liam Neeson',
      accountNumber: '•••• •••• •••• 4402',
      ifscCode: 'APEX0001092',
      salary: 95000
    },
    timeline: [
      { date: '2022-02-22', title: 'Joined StaffBase', desc: 'Began network security audits.' }
    ],
    documents: [
      { id: 'doc-108-1', name: 'Contract NDA', type: 'PDF', status: 'Verified', dateUploaded: '2022-02-20', expiryDate: 'N/A' }
    ]
  }
];

export const MOCK_ACTIVITY_LOGS = [
  { id: 'log-1', timestamp: '2026-05-20T09:12:00Z', operator: 'Sarah Jenkins', action: 'Employee Confirmed', detail: 'Robert Vance probation confirmation status reviewed.' },
  { id: 'log-2', timestamp: '2026-05-20T08:30:00Z', operator: 'Michael Chen', action: 'Document Uploaded', detail: 'John Doe uploaded new Driver License Copy.' },
  { id: 'log-3', timestamp: '2026-05-20T08:15:00Z', operator: 'Sarah Jenkins', action: 'Role Update', detail: 'Amanda Ross permissions extended in Department UI.' },
  { id: 'log-4', timestamp: '2026-05-19T14:45:00Z', operator: 'Elena Rostova', action: 'Salary Management', detail: 'Monthly payroll batches generated and submitted.' },
  { id: 'log-5', timestamp: '2026-05-19T10:05:00Z', operator: 'Sarah Jenkins', action: 'Department Created', detail: 'New department "Finance" configured under Elena Rostova.' }
];

export const SYSTEM_SETTINGS = {
  companyName: 'StaffBase Inc.',
  allowSelfRegistration: true,
  sessionTimeoutMinutes: 30,
  passwordExpiryDays: 90,
  enableMfa: false,
  notificationEmails: 'hr-alerts@staffbase.com'
};
