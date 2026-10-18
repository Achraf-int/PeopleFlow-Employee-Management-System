import {
  Employee,
  Department,
  EmployeeFilters,
  PagedResponse,
  DashboardStats,
  ReportFilter,
  SystemInfo
} from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;
  details?: any;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = (isJson && data?.message) || response.statusText || 'Request failed';
    const fieldErrors = isJson && data?.fieldErrors ? data.fieldErrors : undefined;
    throw new ApiError(message, response.status, fieldErrors, data);
  }

  return data as T;
}

export const apiService = {
  // Employee Endpoints
  async getEmployees(filters: EmployeeFilters = {}): Promise<PagedResponse<Employee>> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    if (filters.status) params.append('status', filters.status);
    if (filters.employmentType) params.append('employmentType', filters.employmentType);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const qs = params.toString();
    return request<PagedResponse<Employee>>(`/employees${qs ? `?${qs}` : ''}`);
  },

  async getEmployee(id: string): Promise<Employee> {
    return request<Employee>(`/employees/${id}`);
  },

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    return request<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return request<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteEmployee(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/employees/${id}`, {
      method: 'DELETE',
    });
  },

  // Department Endpoints
  async getDepartments(): Promise<Department[]> {
    return request<Department[]>('/departments');
  },

  async getDepartment(id: string): Promise<Department & { members: Employee[] }> {
    return request<Department & { members: Employee[] }>(`/departments/${id}`);
  },

  async createDepartment(data: Partial<Department>): Promise<Department> {
    return request<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    return request<Department>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteDepartment(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/departments/${id}`, {
      method: 'DELETE',
    });
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/dashboard');
  },

  // Reports
  async getReports(filter: ReportFilter = {}): Promise<any> {
    const params = new URLSearchParams();
    if (filter.departmentId) params.append('departmentId', filter.departmentId);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);
    if (filter.status) params.append('status', filter.status);
    if (filter.employmentType) params.append('employmentType', filter.employmentType);

    const qs = params.toString();
    return request<any>(`/reports/employees${qs ? `?${qs}` : ''}`);
  },

  // CSV Export
  async exportEmployeesCsv(): Promise<void> {
    const response = await fetch(`${API_BASE}/reports/employees/export`);
    if (!response.ok) {
      throw new Error('Failed to generate CSV export');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `peopleflow_employees_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // System
  async getSystemInfo(): Promise<SystemInfo> {
    return request<SystemInfo>('/system/info');
  },

  async resetSystemData(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/system/reset', {
      method: 'POST',
    });
  },
};
