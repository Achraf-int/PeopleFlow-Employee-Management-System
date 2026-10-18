export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type EmploymentStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerName: string;
  managerEmail?: string;
  employeeCount?: number;
  budget?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id: string;
  employeeId: string; // Unique string identifier e.g. EMP-1001
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName?: string;
  jobTitle: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  dateHired: string; // YYYY-MM-DD
  workLocation: string; // e.g. "San Francisco, CA" or "Remote"
  imageUrl?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
  sortBy?: 'name' | 'dateHired' | 'department' | 'employeeId';
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PagedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  onLeaveEmployees: number;
  inactiveEmployees: number;
  departmentDistribution: {
    departmentId: string;
    departmentName: string;
    count: number;
    percentage: number;
  }[];
  statusDistribution: {
    status: EmploymentStatus;
    count: number;
    percentage: number;
  }[];
  employmentTypeDistribution: {
    type: EmploymentType;
    count: number;
    percentage: number;
  }[];
  recentEmployees: Employee[];
  recentActivities: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'EMPLOYEE_ADDED' | 'EMPLOYEE_UPDATED' | 'EMPLOYEE_DELETED' | 'DEPARTMENT_ADDED' | 'DEPARTMENT_UPDATED';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface ReportFilter {
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  employmentType?: string;
  status?: string;
}

export interface SystemInfo {
  version: string;
  environment: string;
  backendServer: string;
  springBootCompatible: boolean;
  database: string;
  uptimeSeconds: number;
  recordsCount: {
    employees: number;
    departments: number;
  };
}
