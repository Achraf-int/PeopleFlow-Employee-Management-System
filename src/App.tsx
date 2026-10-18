import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Sidebar, NavigationPage } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { EmployeeModal } from './components/EmployeeModal';
import { EmployeeDetailDrawer } from './components/EmployeeDetailDrawer';
import { DepartmentManagement } from './components/DepartmentManagement';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { SettingsView } from './components/SettingsView';
import { ConfirmDialog } from './components/ConfirmDialog';
import { apiService } from './services/api';
import { Employee, Department, DashboardStats, EmployeeFilters } from './types';

function MainApp() {
  const { success, error, info } = useToast();

  // Navigation State
  const [activePage, setActivePage] = useState<NavigationPage>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data States
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  // Pagination & Filters for Directory
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: '',
    departmentId: '',
    status: '',
    employmentType: '',
    sortBy: 'name',
    sortDir: 'asc',
    page: 1,
    limit: 8
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1
  });

  // UI / Modal States
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Modals & Drawers
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [drawerEmployee, setDrawerEmployee] = useState<Employee | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState(false);

  // Department quick filter trigger
  const [departmentToCreate, setDepartmentToCreate] = useState(false);

  // Load Departments
  const loadDepartments = useCallback(async () => {
    setLoadingDepartments(true);
    try {
      const data = await apiService.getDepartments();
      setDepartments(data);
    } catch (err: any) {
      error('Failed to load departments', err.message);
    } finally {
      setLoadingDepartments(false);
    }
  }, [error]);

  // Load Dashboard Statistics
  const loadDashboardStats = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);
    } catch (err: any) {
      error('Failed to load dashboard metrics', err.message);
    } finally {
      setLoadingDashboard(false);
    }
  }, [error]);

  // Load Employees with current filters
  const loadEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    try {
      const res = await apiService.getEmployees(filters);
      setEmployees(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      error('Failed to load employees', err.message);
    } finally {
      setLoadingEmployees(false);
    }
  }, [filters, error]);

  // Initial load
  useEffect(() => {
    loadDepartments();
    loadDashboardStats();
  }, [loadDepartments, loadDashboardStats]);

  // Load employees whenever filters change
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Refresh all state after mutations
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadDepartments(),
      loadDashboardStats(),
      loadEmployees()
    ]);
  }, [loadDepartments, loadDashboardStats, loadEmployees]);

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<EmployeeFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      departmentId: '',
      status: '',
      employmentType: '',
      sortBy: 'name',
      sortDir: 'asc',
      page: 1,
      limit: 8
    });
  };

  // Employee CRUD handlers
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeModalOpen(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setDrawerEmployee(null);
    setEditingEmployee(emp);
    setEmployeeModalOpen(true);
  };

  const handleViewEmployee = (emp: Employee) => {
    setDrawerEmployee(emp);
  };

  const handleDeleteEmployeePrompt = (emp: Employee) => {
    setDrawerEmployee(null);
    setDeleteCandidate(emp);
  };

  const handleConfirmDeleteEmployee = async () => {
    if (!deleteCandidate) return;
    setDeletingEmployee(true);
    try {
      const res = await apiService.deleteEmployee(deleteCandidate.id);
      success('Employee Deleted', res.message || `${deleteCandidate.firstName} ${deleteCandidate.lastName} was removed.`);
      setDeleteCandidate(null);
      await refreshAll();
    } catch (err: any) {
      error('Deletion Failed', err.message || 'Unable to delete employee record.');
    } finally {
      setDeletingEmployee(false);
    }
  };

  const handleSaveEmployee = async (formData: Partial<Employee>) => {
    if (editingEmployee) {
      const updated = await apiService.updateEmployee(editingEmployee.id, formData);
      success('Employee Profile Updated', `${updated.firstName} ${updated.lastName}'s records have been updated.`);
    } else {
      const created = await apiService.createEmployee(formData);
      success('Employee Registered', `Welcome ${created.firstName} ${created.lastName} to the team!`);
    }
    await refreshAll();
  };

  // Department actions
  const handleAddDepartment = async (data: Partial<Department>) => {
    const created = await apiService.createDepartment(data);
    success('Department Created', `New department ${created.name} (${created.code}) created successfully.`);
    await refreshAll();
  };

  const handleUpdateDepartment = async (id: string, data: Partial<Department>) => {
    const updated = await apiService.updateDepartment(id, data);
    success('Department Updated', `${updated.name} department settings saved.`);
    await refreshAll();
  };

  const handleDeleteDepartment = async (id: string) => {
    const res = await apiService.deleteDepartment(id);
    success('Department Removed', res.message || 'Department successfully deleted.');
    await refreshAll();
  };

  const handleFilterEmployeesByDept = (deptId: string) => {
    setFilters(prev => ({
      ...prev,
      departmentId: deptId,
      page: 1
    }));
    setActivePage('employees');
  };

  // Next Suggested Employee ID calculation
  const nextEmployeeId = useMemo(() => {
    if (employees.length === 0) return 'EMP-1001';
    const nums = employees
      .map(e => parseInt(e.employeeId.replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const max = nums.length > 0 ? Math.max(...nums) : 1000;
    return `EMP-${max + 1}`;
  }, [employees]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        employeeCount={pagination.total || employees.length}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Header */}
        <Header
          activePage={activePage}
          onNavigate={setActivePage}
          searchQuery={filters.search || ''}
          onSearchChange={(q) => {
            if (activePage !== 'employees') {
              setActivePage('employees');
            }
            handleFilterChange({ search: q, page: 1 });
          }}
          onOpenAddEmployee={handleOpenAddEmployee}
        />

        {/* Viewport Router */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'overview' && (
            <OverviewDashboard
              stats={dashboardStats}
              loading={loadingDashboard}
              onNavigate={setActivePage}
              onOpenAddEmployee={handleOpenAddEmployee}
              onOpenAddDepartment={() => {
                setActivePage('departments');
              }}
              onSelectEmployee={handleViewEmployee}
            />
          )}

          {activePage === 'employees' && (
            <EmployeeDirectory
              employees={employees}
              departments={departments}
              filters={filters}
              onFilterChange={handleFilterChange}
              pagination={pagination}
              loading={loadingEmployees}
              onOpenAdd={handleOpenAddEmployee}
              onView={handleViewEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployeePrompt}
              onClearFilters={handleClearFilters}
            />
          )}

          {activePage === 'departments' && (
            <DepartmentManagement
              departments={departments}
              employees={employees}
              loading={loadingDepartments}
              onAddDepartment={handleAddDepartment}
              onUpdateDepartment={handleUpdateDepartment}
              onDeleteDepartment={handleDeleteDepartment}
              onFilterEmployeesByDept={handleFilterEmployeesByDept}
            />
          )}

          {activePage === 'reports' && (
            <ReportsAnalytics
              departments={departments}
              employees={employees}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView
              onRefreshData={refreshAll}
            />
          )}
        </main>
      </div>

      {/* Employee Add / Edit Modal */}
      <EmployeeModal
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        onSubmit={handleSaveEmployee}
        initialData={editingEmployee}
        departments={departments}
        nextSuggestedId={nextEmployeeId}
      />

      {/* Employee Detail Drawer */}
      <EmployeeDetailDrawer
        employee={drawerEmployee}
        onClose={() => setDrawerEmployee(null)}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployeePrompt}
      />

      {/* Delete Employee Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Employee Record"
        message={
          deleteCandidate
            ? `Are you sure you want to remove ${deleteCandidate.firstName} ${deleteCandidate.lastName} (${deleteCandidate.employeeId}) from Auspify Technologies? This action will permanently delete their employment history.`
            : ''
        }
        confirmLabel="Delete Employee"
        isDestructive={true}
        isLoading={deletingEmployee}
        onConfirm={handleConfirmDeleteEmployee}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
