import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-Memory Data Store with Auspify Technologies Seed Records
interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  managerName: string;
  managerEmail: string;
  budget: number;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeRecord {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  jobTitle: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  employmentStatus: 'Active' | 'On Leave' | 'Inactive';
  dateHired: string; // YYYY-MM-DD
  workLocation: string;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ActivityRecord {
  id: string;
  type: 'EMPLOYEE_ADDED' | 'EMPLOYEE_UPDATED' | 'EMPLOYEE_DELETED' | 'DEPARTMENT_ADDED' | 'DEPARTMENT_UPDATED';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

const getInitialDepartments = (): DepartmentRecord[] => [
  {
    id: 'dept-eng',
    name: 'Engineering',
    code: 'ENG',
    description: 'Core software development, cloud infrastructure, and platform engineering.',
    managerName: 'Marcus Vance',
    managerEmail: 'marcus.vance@auspify.com',
    budget: 850000,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'dept-prod',
    name: 'Product & Design',
    code: 'PRD',
    description: 'Product strategy, UX/UI design, design systems, and user research.',
    managerName: 'Elena Rostova',
    managerEmail: 'elena.rostova@auspify.com',
    budget: 420000,
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z'
  },
  {
    id: 'dept-hr',
    name: 'Human Resources',
    code: 'HR',
    description: 'Talent acquisition, employee experience, compensation, and workplace culture.',
    managerName: 'Sarah Chen',
    managerEmail: 'sarah.chen@auspify.com',
    budget: 280000,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'dept-mktg',
    name: 'Marketing & Growth',
    code: 'MKT',
    description: 'Brand positioning, demand generation, developer relations, and content.',
    managerName: 'Julian Sterling',
    managerEmail: 'julian.sterling@auspify.com',
    budget: 350000,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 'dept-fin',
    name: 'Finance & Operations',
    code: 'FIN',
    description: 'Corporate accounting, financial planning, compliance, and enterprise logistics.',
    managerName: 'Priya Patel',
    managerEmail: 'priya.patel@auspify.com',
    budget: 310000,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z'
  },
  {
    id: 'dept-cust',
    name: 'Customer Success',
    code: 'CS',
    description: 'Client onboarding, technical support, account management, and SLA delivery.',
    managerName: 'David Kim',
    managerEmail: 'david.kim@auspify.com',
    budget: 240000,
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z'
  }
];

const getInitialEmployees = (): EmployeeRecord[] => [
  {
    id: 'emp-1001',
    employeeId: 'EMP-1001',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@auspify.com',
    phone: '+1 (415) 555-0142',
    departmentId: 'dept-eng',
    jobTitle: 'VP of Engineering',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-03-15',
    workLocation: 'San Francisco HQ',
    notes: 'Oversees engineering architecture and technical roadmap.',
    createdAt: '2023-03-15T08:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'emp-1002',
    employeeId: 'EMP-1002',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@auspify.com',
    phone: '+1 (415) 555-0188',
    departmentId: 'dept-hr',
    jobTitle: 'Head of People & Culture',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-04-01',
    workLocation: 'San Francisco HQ',
    notes: 'Internship coordinator and organization designer.',
    createdAt: '2023-04-01T08:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'emp-1003',
    employeeId: 'EMP-1003',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@auspify.com',
    phone: '+1 (415) 555-0193',
    departmentId: 'dept-prod',
    jobTitle: 'Lead Product Designer',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-05-12',
    workLocation: 'New York Office',
    notes: 'Spearheading design system modernization.',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z'
  },
  {
    id: 'emp-1004',
    employeeId: 'EMP-1004',
    firstName: 'Julian',
    lastName: 'Sterling',
    email: 'julian.sterling@auspify.com',
    phone: '+1 (415) 555-0112',
    departmentId: 'dept-mktg',
    jobTitle: 'Director of Growth Marketing',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-06-01',
    workLocation: 'Austin, TX (Remote)',
    notes: 'Leading B2B enterprise acquisition campaigns.',
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 'emp-1005',
    employeeId: 'EMP-1005',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@auspify.com',
    phone: '+1 (415) 555-0165',
    departmentId: 'dept-fin',
    jobTitle: 'Senior Financial Controller',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-07-15',
    workLocation: 'San Francisco HQ',
    notes: 'Quarterly financial auditing and cap table management.',
    createdAt: '2023-07-15T08:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z'
  },
  {
    id: 'emp-1006',
    employeeId: 'EMP-1006',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@auspify.com',
    phone: '+1 (415) 555-0177',
    departmentId: 'dept-cust',
    jobTitle: 'Customer Success Manager',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-08-20',
    workLocation: 'Chicago Office',
    notes: 'Enterprise account onboarding and retention.',
    createdAt: '2023-08-20T08:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z'
  },
  {
    id: 'emp-1007',
    employeeId: 'EMP-1007',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@auspify.com',
    phone: '+1 (415) 555-0131',
    departmentId: 'dept-eng',
    jobTitle: 'Staff Backend Architect',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-09-01',
    workLocation: 'San Francisco HQ',
    notes: 'Microservices architecture, Spring Boot & database scaling.',
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2024-03-05T09:00:00Z'
  },
  {
    id: 'emp-1008',
    employeeId: 'EMP-1008',
    firstName: 'Liam',
    lastName: 'Nakamura',
    email: 'liam.nakamura@auspify.com',
    phone: '+1 (415) 555-0129',
    departmentId: 'dept-eng',
    jobTitle: 'Senior Full-Stack Engineer',
    employmentType: 'Full-time',
    employmentStatus: 'On Leave',
    dateHired: '2023-10-15',
    workLocation: 'Seattle, WA (Remote)',
    notes: 'On parental leave until next month.',
    createdAt: '2023-10-15T08:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z'
  },
  {
    id: 'emp-1009',
    employeeId: 'EMP-1009',
    firstName: 'Chloe',
    lastName: 'Dupont',
    email: 'chloe.dupont@auspify.com',
    phone: '+1 (415) 555-0158',
    departmentId: 'dept-prod',
    jobTitle: 'Senior Product Manager',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-11-01',
    workLocation: 'San Francisco HQ',
    notes: 'Leading HR management system initiative.',
    createdAt: '2023-11-01T08:00:00Z',
    updatedAt: '2024-03-12T09:00:00Z'
  },
  {
    id: 'emp-1010',
    employeeId: 'EMP-1010',
    firstName: 'Tariq',
    lastName: 'Al-Mansoor',
    email: 'tariq.almansoor@auspify.com',
    phone: '+1 (415) 555-0199',
    departmentId: 'dept-eng',
    jobTitle: 'DevOps & Site Reliability Engineer',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2023-12-05',
    workLocation: 'San Francisco HQ',
    notes: 'Kubernetes, CI/CD pipelines, and cloud security compliance.',
    createdAt: '2023-12-05T08:00:00Z',
    updatedAt: '2024-03-15T09:00:00Z'
  },
  {
    id: 'emp-1011',
    employeeId: 'EMP-1011',
    firstName: 'Kavita',
    lastName: 'Sharma',
    email: 'kavita.sharma@auspify.com',
    phone: '+1 (415) 555-0144',
    departmentId: 'dept-mktg',
    jobTitle: 'Content & Brand Strategist',
    employmentType: 'Contract',
    employmentStatus: 'Active',
    dateHired: '2024-01-08',
    workLocation: 'New York Office',
    notes: '6-month contract for rebranding launch.',
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-03-18T09:00:00Z'
  },
  {
    id: 'emp-1012',
    employeeId: 'EMP-1012',
    firstName: 'Mateo',
    lastName: 'Silva',
    email: 'mateo.silva@auspify.com',
    phone: '+1 (415) 555-0182',
    departmentId: 'dept-eng',
    jobTitle: 'Software Engineering Intern',
    employmentType: 'Intern',
    employmentStatus: 'Active',
    dateHired: '2024-02-01',
    workLocation: 'San Francisco HQ',
    notes: 'Building the PeopleFlow Employee Management System.',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-20T09:00:00Z'
  },
  {
    id: 'emp-1013',
    employeeId: 'EMP-1013',
    firstName: 'Sofia',
    lastName: 'Lindqvist',
    email: 'sofia.lindqvist@auspify.com',
    phone: '+1 (415) 555-0161',
    departmentId: 'dept-prod',
    jobTitle: 'UX Researcher',
    employmentType: 'Part-time',
    employmentStatus: 'Active',
    dateHired: '2024-02-15',
    workLocation: 'Remote (Sweden/EST)',
    notes: 'Conducting employee experience user studies.',
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-03-22T09:00:00Z'
  },
  {
    id: 'emp-1014',
    employeeId: 'EMP-1014',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    email: 'carlos.mendoza@auspify.com',
    phone: '+1 (415) 555-0136',
    departmentId: 'dept-hr',
    jobTitle: 'Talent Acquisition Specialist',
    employmentType: 'Full-time',
    employmentStatus: 'On Leave',
    dateHired: '2024-03-01',
    workLocation: 'San Francisco HQ',
    notes: 'Scheduled medical leave, returns in 2 weeks.',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-25T09:00:00Z'
  },
  {
    id: 'emp-1015',
    employeeId: 'EMP-1015',
    firstName: 'Aaliyah',
    lastName: 'Washington',
    email: 'aaliyah.washington@auspify.com',
    phone: '+1 (415) 555-0173',
    departmentId: 'dept-eng',
    jobTitle: 'QA Automation Engineer',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    dateHired: '2024-03-10',
    workLocation: 'Denver, CO (Remote)',
    notes: 'End-to-end Cypress & JUnit regression testing.',
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-26T09:00:00Z'
  },
  {
    id: 'emp-1016',
    employeeId: 'EMP-1016',
    firstName: 'Lucas',
    lastName: 'Weber',
    email: 'lucas.weber@auspify.com',
    phone: '+1 (415) 555-0118',
    departmentId: 'dept-cust',
    jobTitle: 'Technical Support Specialist',
    employmentType: 'Full-time',
    employmentStatus: 'Inactive',
    dateHired: '2023-05-01',
    workLocation: 'Berlin Office',
    notes: 'Transitioned out of company in Feb 2024.',
    createdAt: '2023-05-01T08:00:00Z',
    updatedAt: '2024-02-28T09:00:00Z'
  }
];

const getInitialActivities = (): ActivityRecord[] => [
  {
    id: 'act-1',
    type: 'EMPLOYEE_ADDED',
    title: 'New Employee Hired',
    description: 'Aaliyah Washington joined Engineering as QA Automation Engineer.',
    timestamp: '2024-03-10T09:15:00Z',
    user: 'Sarah Chen'
  },
  {
    id: 'act-2',
    type: 'EMPLOYEE_UPDATED',
    title: 'Status Updated to On Leave',
    description: 'Carlos Mendoza (Talent Acquisition Specialist) marked as On Leave.',
    timestamp: '2024-03-08T14:30:00Z',
    user: 'Sarah Chen'
  },
  {
    id: 'act-3',
    type: 'DEPARTMENT_ADDED',
    title: 'New Department Created',
    description: 'Customer Success department officially established with David Kim as lead.',
    timestamp: '2024-03-01T11:00:00Z',
    user: 'Sarah Chen'
  },
  {
    id: 'act-4',
    type: 'EMPLOYEE_ADDED',
    title: 'Software Engineering Intern Onboarded',
    description: 'Mateo Silva onboarded for Auspify Software Engineering Internship.',
    timestamp: '2024-02-01T10:00:00Z',
    user: 'Marcus Vance'
  },
  {
    id: 'act-5',
    type: 'EMPLOYEE_UPDATED',
    title: 'Department Promotion',
    description: 'Elena Rostova promoted to Lead Product Designer.',
    timestamp: '2024-01-20T16:45:00Z',
    user: 'Sarah Chen'
  }
];

let departments: DepartmentRecord[] = getInitialDepartments();
let employees: EmployeeRecord[] = getInitialEmployees();
let activities: ActivityRecord[] = getInitialActivities();

// Helper to log activities
const logActivity = (type: ActivityRecord['type'], title: string, description: string, user: string = 'Sarah Chen') => {
  const newActivity: ActivityRecord = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
    user
  };
  activities.unshift(newActivity);
  if (activities.length > 50) {
    activities = activities.slice(0, 50);
  }
};

// Helper to attach department names and employee counts
const enrichDepartment = (dept: DepartmentRecord) => {
  const count = employees.filter(e => e.departmentId === dept.id).length;
  return {
    ...dept,
    employeeCount: count
  };
};

const enrichEmployee = (emp: EmployeeRecord) => {
  const dept = departments.find(d => d.id === emp.departmentId);
  return {
    ...emp,
    departmentName: dept ? dept.name : 'Unknown Department'
  };
};

// ==========================================
// REST API ROUTES
// ==========================================

// 1. EMPLOYEES CRUD & PAGINATION

// GET /api/employees
app.get('/api/employees', (req: Request, res: Response) => {
  try {
    const {
      search = '',
      departmentId = '',
      status = '',
      employmentType = '',
      sortBy = 'name',
      sortDir = 'asc',
      page = '1',
      limit = '8'
    } = req.query as Record<string, string>;

    let result = employees.map(enrichEmployee);

    // Filter by search string
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.jobTitle.toLowerCase().includes(q)
      );
    }

    // Filter by department
    if (departmentId.trim()) {
      result = result.filter(emp => emp.departmentId === departmentId.trim());
    }

    // Filter by status
    if (status.trim()) {
      result = result.filter(emp => emp.employmentStatus.toLowerCase() === status.trim().toLowerCase());
    }

    // Filter by employment type
    if (employmentType.trim()) {
      result = result.filter(emp => emp.employmentType.toLowerCase() === employmentType.trim().toLowerCase());
    }

    // Sort
    const dir = sortDir === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB) * dir;
      }
      if (sortBy === 'dateHired') {
        return (new Date(a.dateHired).getTime() - new Date(b.dateHired).getTime()) * dir;
      }
      if (sortBy === 'department') {
        return (a.departmentName || '').localeCompare(b.departmentName || '') * dir;
      }
      if (sortBy === 'employeeId') {
        return a.employeeId.localeCompare(b.employeeId) * dir;
      }
      return 0;
    });

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 8);
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const offset = (pageNum - 1) * limitNum;
    const pagedData = result.slice(offset, offset + limitNum);

    res.json({
      data: pagedData,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve employees', message: error.message });
  }
});

// GET /api/employees/:id
app.get('/api/employees/:id', (req: Request, res: Response) => {
  const employee = employees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Not Found', message: `Employee with ID ${req.params.id} does not exist.` });
  }
  res.json(enrichEmployee(employee));
});

// POST /api/employees
app.post('/api/employees', (req: Request, res: Response) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      departmentId,
      jobTitle,
      employmentType,
      employmentStatus,
      dateHired,
      workLocation,
      notes,
      imageUrl
    } = req.body;

    // Field Validation
    const errors: Record<string, string> = {};
    if (!employeeId || !employeeId.trim()) errors.employeeId = 'Employee ID is required';
    if (!firstName || !firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName || !lastName.trim()) errors.lastName = 'Last name is required';
    if (!email || !email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
    if (!departmentId) errors.departmentId = 'Department selection is required';
    if (!jobTitle || !jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!employmentType) errors.employmentType = 'Employment type is required';
    if (!employmentStatus) errors.employmentStatus = 'Employment status is required';
    if (!dateHired) errors.dateHired = 'Date hired is required';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Validation Failed',
        message: 'Please resolve the highlighted field errors.',
        fieldErrors: errors
      });
    }

    // Check unique employeeId
    const existingId = employees.find(e => e.employeeId.toLowerCase() === employeeId.trim().toLowerCase());
    if (existingId) {
      return res.status(409).json({
        error: 'Duplicate Employee ID',
        message: `Employee ID '${employeeId.trim()}' is already assigned to ${existingId.firstName} ${existingId.lastName}.`,
        fieldErrors: { employeeId: 'Employee ID must be unique across the organization' }
      });
    }

    // Check unique email
    const existingEmail = employees.find(e => e.email.toLowerCase() === email.trim().toLowerCase());
    if (existingEmail) {
      return res.status(409).json({
        error: 'Duplicate Email Address',
        message: `Email address '${email.trim()}' is already registered to another employee.`,
        fieldErrors: { email: 'Email address must be unique' }
      });
    }

    // Check valid department
    const dept = departments.find(d => d.id === departmentId);
    if (!dept) {
      return res.status(400).json({
        error: 'Invalid Department',
        message: 'Selected department does not exist.',
        fieldErrors: { departmentId: 'Please select an existing department' }
      });
    }

    const now = new Date().toISOString();
    const newEmployee: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      employeeId: employeeId.trim().toUpperCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      departmentId,
      jobTitle: jobTitle.trim(),
      employmentType,
      employmentStatus,
      dateHired,
      workLocation: (workLocation || 'San Francisco HQ').trim(),
      imageUrl: imageUrl?.trim() || undefined,
      notes: notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now
    };

    employees.unshift(newEmployee);
    logActivity('EMPLOYEE_ADDED', 'New Employee Registered', `${newEmployee.firstName} ${newEmployee.lastName} (${newEmployee.jobTitle}) added to ${dept.name}.`);

    res.status(201).json(enrichEmployee(newEmployee));
  } catch (error: any) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// PUT /api/employees/:id
app.put('/api/employees/:id', (req: Request, res: Response) => {
  try {
    const index = employees.findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: `Employee with ID ${req.params.id} does not exist.` });
    }

    const current = employees[index];
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      departmentId,
      jobTitle,
      employmentType,
      employmentStatus,
      dateHired,
      workLocation,
      notes,
      imageUrl
    } = req.body;

    // Field Validation
    const errors: Record<string, string> = {};
    if (!employeeId || !employeeId.trim()) errors.employeeId = 'Employee ID is required';
    if (!firstName || !firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName || !lastName.trim()) errors.lastName = 'Last name is required';
    if (!email || !email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
    if (!departmentId) errors.departmentId = 'Department selection is required';
    if (!jobTitle || !jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!employmentType) errors.employmentType = 'Employment type is required';
    if (!employmentStatus) errors.employmentStatus = 'Employment status is required';
    if (!dateHired) errors.dateHired = 'Date hired is required';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Validation Failed',
        message: 'Please resolve the highlighted field errors.',
        fieldErrors: errors
      });
    }

    // Check unique employeeId if changed
    if (employeeId.trim().toLowerCase() !== current.employeeId.toLowerCase()) {
      const existingId = employees.find(e => e.id !== current.id && e.employeeId.toLowerCase() === employeeId.trim().toLowerCase());
      if (existingId) {
        return res.status(409).json({
          error: 'Duplicate Employee ID',
          message: `Employee ID '${employeeId.trim()}' is already used by ${existingId.firstName} ${existingId.lastName}.`,
          fieldErrors: { employeeId: 'Employee ID must be unique' }
        });
      }
    }

    // Check unique email if changed
    if (email.trim().toLowerCase() !== current.email.toLowerCase()) {
      const existingEmail = employees.find(e => e.id !== current.id && e.email.toLowerCase() === email.trim().toLowerCase());
      if (existingEmail) {
        return res.status(409).json({
          error: 'Duplicate Email Address',
          message: `Email address '${email.trim()}' is already registered to another employee.`,
          fieldErrors: { email: 'Email address must be unique' }
        });
      }
    }

    const updated: EmployeeRecord = {
      ...current,
      employeeId: employeeId.trim().toUpperCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      departmentId,
      jobTitle: jobTitle.trim(),
      employmentType,
      employmentStatus,
      dateHired,
      workLocation: (workLocation || current.workLocation).trim(),
      imageUrl: imageUrl?.trim() || undefined,
      notes: notes?.trim() || undefined,
      updatedAt: new Date().toISOString()
    };

    employees[index] = updated;
    logActivity('EMPLOYEE_UPDATED', 'Employee Profile Updated', `Updated details for ${updated.firstName} ${updated.lastName}.`);

    res.json(enrichEmployee(updated));
  } catch (error: any) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// DELETE /api/employees/:id
app.delete('/api/employees/:id', (req: Request, res: Response) => {
  const index = employees.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Employee with ID ${req.params.id} does not exist.` });
  }

  const removed = employees[index];
  employees.splice(index, 1);
  logActivity('EMPLOYEE_DELETED', 'Employee Record Deleted', `Removed ${removed.firstName} ${removed.lastName} (${removed.employeeId}) from system.`);

  res.json({
    success: true,
    message: `Employee ${removed.firstName} ${removed.lastName} successfully deleted.`
  });
});

// ==========================================
// 2. DEPARTMENTS CRUD & CONSTRAINTS
// ==========================================

// GET /api/departments
app.get('/api/departments', (req: Request, res: Response) => {
  const result = departments.map(enrichDepartment);
  res.json(result);
});

// GET /api/departments/:id
app.get('/api/departments/:id', (req: Request, res: Response) => {
  const dept = departments.find(d => d.id === req.params.id);
  if (!dept) {
    return res.status(404).json({ error: 'Not Found', message: `Department with ID ${req.params.id} does not exist.` });
  }
  const enriched = enrichDepartment(dept);
  const deptEmployees = employees.filter(e => e.departmentId === dept.id).map(enrichEmployee);
  res.json({
    ...enriched,
    members: deptEmployees
  });
});

// POST /api/departments
app.post('/api/departments', (req: Request, res: Response) => {
  try {
    const { name, code, description, managerName, managerEmail, budget } = req.body;
    const errors: Record<string, string> = {};
    if (!name || !name.trim()) errors.name = 'Department name is required';
    if (!code || !code.trim()) errors.code = 'Department code is required (e.g. ENG, HR)';
    if (!description || !description.trim()) errors.description = 'Description is required';
    if (!managerName || !managerName.trim()) errors.managerName = 'Department manager is required';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Validation Failed', message: 'Please provide all required department information.', fieldErrors: errors });
    }

    // Check duplicate name
    if (departments.some(d => d.name.toLowerCase() === name.trim().toLowerCase())) {
      return res.status(409).json({
        error: 'Duplicate Department Name',
        message: `A department named '${name.trim()}' already exists.`,
        fieldErrors: { name: 'Department name must be unique' }
      });
    }

    // Check duplicate code
    if (departments.some(d => d.code.toLowerCase() === code.trim().toLowerCase())) {
      return res.status(409).json({
        error: 'Duplicate Department Code',
        message: `Department code '${code.trim().toUpperCase()}' is already in use.`,
        fieldErrors: { code: 'Department code must be unique' }
      });
    }

    const now = new Date().toISOString();
    const newDept: DepartmentRecord = {
      id: `dept-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      managerName: managerName.trim(),
      managerEmail: (managerEmail || '').trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@auspify.com`,
      budget: Number(budget) || 250000,
      createdAt: now,
      updatedAt: now
    };

    departments.push(newDept);
    logActivity('DEPARTMENT_ADDED', 'New Department Created', `Created department ${newDept.name} (${newDept.code}) with manager ${newDept.managerName}.`);

    res.status(201).json(enrichDepartment(newDept));
  } catch (error: any) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// PUT /api/departments/:id
app.put('/api/departments/:id', (req: Request, res: Response) => {
  try {
    const index = departments.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: `Department with ID ${req.params.id} does not exist.` });
    }

    const current = departments[index];
    const { name, code, description, managerName, managerEmail, budget } = req.body;
    const errors: Record<string, string> = {};
    if (!name || !name.trim()) errors.name = 'Department name is required';
    if (!code || !code.trim()) errors.code = 'Department code is required';
    if (!description || !description.trim()) errors.description = 'Description is required';
    if (!managerName || !managerName.trim()) errors.managerName = 'Department manager is required';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Validation Failed', message: 'Please provide all required department information.', fieldErrors: errors });
    }

    // Check duplicate name if changed
    if (name.trim().toLowerCase() !== current.name.toLowerCase()) {
      if (departments.some(d => d.id !== current.id && d.name.toLowerCase() === name.trim().toLowerCase())) {
        return res.status(409).json({
          error: 'Duplicate Department Name',
          message: `Department name '${name.trim()}' is already used.`,
          fieldErrors: { name: 'Department name must be unique' }
        });
      }
    }

    const updated: DepartmentRecord = {
      ...current,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      managerName: managerName.trim(),
      managerEmail: (managerEmail || current.managerEmail).trim(),
      budget: Number(budget) || current.budget,
      updatedAt: new Date().toISOString()
    };

    departments[index] = updated;
    logActivity('DEPARTMENT_UPDATED', 'Department Details Updated', `Updated settings for ${updated.name} department.`);

    res.json(enrichDepartment(updated));
  } catch (error: any) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// DELETE /api/departments/:id (Integrity Rule: Prevent deleting department that still has employees)
app.delete('/api/departments/:id', (req: Request, res: Response) => {
  const index = departments.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Department with ID ${req.params.id} does not exist.` });
  }

  const dept = departments[index];
  const assignedEmployees = employees.filter(e => e.departmentId === dept.id);

  if (assignedEmployees.length > 0) {
    return res.status(400).json({
      error: 'Cannot Delete Department',
      message: `Cannot delete department '${dept.name}' because it currently has ${assignedEmployees.length} employee(s) assigned. Please reassign or transfer these employees first before removing this department.`,
      assignedCount: assignedEmployees.length,
      assignedEmployees: assignedEmployees.slice(0, 5).map(e => `${e.firstName} ${e.lastName} (${e.employeeId})`)
    });
  }

  departments.splice(index, 1);
  logActivity('EMPLOYEE_DELETED', 'Department Removed', `Deleted department ${dept.name} (${dept.code}).`);

  res.json({
    success: true,
    message: `Department '${dept.name}' successfully deleted.`
  });
});

// ==========================================
// 3. DASHBOARD STATS & RECENT ACTIVITIES
// ==========================================

// GET /api/dashboard
app.get('/api/dashboard', (req: Request, res: Response) => {
  try {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.employmentStatus === 'Active').length;
    const onLeaveEmployees = employees.filter(e => e.employmentStatus === 'On Leave').length;
    const inactiveEmployees = employees.filter(e => e.employmentStatus === 'Inactive').length;
    const totalDepartments = departments.length;

    // Headcount by department
    const departmentDistribution = departments.map(d => {
      const count = employees.filter(e => e.departmentId === d.id).length;
      return {
        departmentId: d.id,
        departmentName: d.name,
        code: d.code,
        count,
        percentage: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0
      };
    });

    // Employment status distribution
    const statuses: ('Active' | 'On Leave' | 'Inactive')[] = ['Active', 'On Leave', 'Inactive'];
    const statusDistribution = statuses.map(st => {
      const count = employees.filter(e => e.employmentStatus === st).length;
      return {
        status: st,
        count,
        percentage: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0
      };
    });

    // Employment type distribution
    const types: ('Full-time' | 'Part-time' | 'Contract' | 'Intern')[] = ['Full-time', 'Part-time', 'Contract', 'Intern'];
    const employmentTypeDistribution = types.map(t => {
      const count = employees.filter(e => e.employmentType === t).length;
      return {
        type: t,
        count,
        percentage: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0
      };
    });

    // Recently added employees (sorted by createdAt or dateHired descending)
    const recentEmployees = [...employees]
      .sort((a, b) => new Date(b.dateHired).getTime() - new Date(a.dateHired).getTime())
      .slice(0, 5)
      .map(enrichEmployee);

    // Recent activity list
    const recentActivities = activities.slice(0, 10);

    res.json({
      totalEmployees,
      activeEmployees,
      totalDepartments,
      onLeaveEmployees,
      inactiveEmployees,
      departmentDistribution,
      statusDistribution,
      employmentTypeDistribution,
      recentEmployees,
      recentActivities
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to calculate dashboard statistics', message: error.message });
  }
});

// ==========================================
// 4. REPORTS & CSV EXPORT
// ==========================================

// GET /api/reports/employees
app.get('/api/reports/employees', (req: Request, res: Response) => {
  try {
    const { departmentId, startDate, endDate, employmentType, status } = req.query as Record<string, string>;

    let filtered = employees.map(enrichEmployee);

    if (departmentId && departmentId !== 'ALL') {
      filtered = filtered.filter(e => e.departmentId === departmentId);
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter(e => e.employmentStatus === status);
    }
    if (employmentType && employmentType !== 'ALL') {
      filtered = filtered.filter(e => e.employmentType === employmentType);
    }
    if (startDate) {
      filtered = filtered.filter(e => e.dateHired >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(e => e.dateHired <= endDate);
    }

    // Monthly hiring trends (group by YYYY-MM)
    const hiringByMonthMap: Record<string, number> = {};
    employees.forEach(e => {
      const monthKey = e.dateHired.substring(0, 7); // e.g. "2023-11"
      hiringByMonthMap[monthKey] = (hiringByMonthMap[monthKey] || 0) + 1;
    });

    const monthlyTrends = Object.keys(hiringByMonthMap)
      .sort()
      .map(month => ({
        month,
        hires: hiringByMonthMap[month]
      }));

    res.json({
      summary: {
        totalHeadcount: filtered.length,
        activeCount: filtered.filter(e => e.employmentStatus === 'Active').length,
        onLeaveCount: filtered.filter(e => e.employmentStatus === 'On Leave').length,
        inactiveCount: filtered.filter(e => e.employmentStatus === 'Inactive').length
      },
      filteredRecords: filtered,
      monthlyTrends
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Report generation failed', message: error.message });
  }
});

// GET /api/reports/employees/export - Real CSV Export
app.get('/api/reports/employees/export', (req: Request, res: Response) => {
  try {
    const enriched = employees.map(enrichEmployee);

    // CSV Headers
    const headers = [
      'Employee ID',
      'First Name',
      'Last Name',
      'Email Address',
      'Phone Number',
      'Department',
      'Job Title',
      'Employment Type',
      'Status',
      'Date Hired',
      'Work Location',
      'Notes'
    ];

    const escapeCsv = (str: any) => {
      if (str === undefined || str === null) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = enriched.map(e => [
      escapeCsv(e.employeeId),
      escapeCsv(e.firstName),
      escapeCsv(e.lastName),
      escapeCsv(e.email),
      escapeCsv(e.phone),
      escapeCsv(e.departmentName),
      escapeCsv(e.jobTitle),
      escapeCsv(e.employmentType),
      escapeCsv(e.employmentStatus),
      escapeCsv(e.dateHired),
      escapeCsv(e.workLocation),
      escapeCsv(e.notes || '')
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="peopleflow_employees_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ error: 'CSV Export Failed', message: error.message });
  }
});

// ==========================================
// 5. SYSTEM INFO & DATA MANAGEMENT
// ==========================================

const serverStartTime = Date.now();

app.get('/api/system/info', (_req: Request, res: Response) => {
  res.json({
    version: '1.2.0',
    environment: isProd ? 'production' : 'development',
    backendServer: 'Spring Boot 3.2+ Compatible REST API',
    springBootCompatible: true,
    database: 'In-Memory State Store with MySQL Schema Mirroring',
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    recordsCount: {
      employees: employees.length,
      departments: departments.length
    }
  });
});

// POST /api/system/reset - Reset to default seed data
app.post('/api/system/reset', (_req: Request, res: Response) => {
  departments = getInitialDepartments();
  employees = getInitialEmployees();
  activities = getInitialActivities();
  logActivity('EMPLOYEE_ADDED', 'System Data Reset', 'Reset employee and department data to default seed records.');
  res.json({ success: true, message: 'Sample dataset reset to initial state.' });
});

// ==========================================
// VITE DEV SERVER / STATIC ASSETS MOUNT
// ==========================================

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PeopleFlow Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
