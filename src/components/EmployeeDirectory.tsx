import React from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Building,
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Employee, Department, EmploymentType, EmploymentStatus, EmployeeFilters } from '../types';

interface EmployeeDirectoryProps {
  employees: Employee[];
  departments: Department[];
  filters: EmployeeFilters;
  onFilterChange: (newFilters: Partial<EmployeeFilters>) => void;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  onOpenAdd: () => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onClearFilters: () => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  departments,
  filters,
  onFilterChange,
  pagination,
  loading,
  onOpenAdd,
  onView,
  onEdit,
  onDelete,
  onClearFilters
}) => {
  return (
    <div className="space-y-5">
      {/* Directory Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization members, verify credentials, and review employment status.
          </p>
        </div>

        <button
          onClick={onOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              placeholder="Search name, ID, email, or role..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={filters.departmentId || ''}
              onChange={(e) => onFilterChange({ departmentId: e.target.value, page: 1 })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Employment Type Filter */}
          <div>
            <select
              value={filters.employmentType || ''}
              onChange={(e) => onFilterChange({ employmentType: e.target.value, page: 1 })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
        </div>

        {/* Secondary Bar: Active Filters count & Sorting Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-800 font-mono tabular-nums">{pagination.total}</strong> registered employees
            </span>
            {(filters.search || filters.departmentId || filters.status || filters.employmentType) && (
              <button
                onClick={onClearFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 ml-1"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={filters.sortBy || 'name'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="px-2 py-1 text-xs bg-white text-slate-800 border border-slate-200 rounded-md focus:outline-hidden"
            >
              <option value="name">Name</option>
              <option value="dateHired">Date Hired</option>
              <option value="department">Department</option>
              <option value="employeeId">Employee ID</option>
            </select>

            <button
              onClick={() => onFilterChange({ sortDir: filters.sortDir === 'desc' ? 'asc' : 'desc' })}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase text-[10px] font-mono">{filters.sortDir || 'asc'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="p-4 bg-slate-100 text-slate-400 rounded-2xl mb-3">
              <UserX className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No employees match criteria</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              We couldn't find any employees matching your current filters. Try searching with different keywords or clear existing filters.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={onClearFilters}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
              <button
                onClick={onOpenAdd}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Add new employee
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Employee</th>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date Hired</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {employees.map(emp => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onView(emp)}
                  >
                    {/* Employee Avatar & Name */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs ring-1 ring-slate-200 shrink-0">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-600 tabular-nums">
                      {emp.employeeId}
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {emp.departmentName}
                    </td>

                    {/* Job Title */}
                    <td className="py-3 px-4 text-slate-600">
                      {emp.jobTitle}
                    </td>

                    {/* Employment Type */}
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {emp.employmentType}
                      </span>
                    </td>

                    {/* Date Hired */}
                    <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                      {emp.dateHired}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                          emp.employmentStatus === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : emp.employmentStatus === 'On Leave'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {emp.employmentStatus}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td
                      className="py-3 px-5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(emp)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(emp)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Record"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(emp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && employees.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 gap-3">
            <div>
              Showing <span className="font-mono font-medium text-slate-800">{Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}</span> to{' '}
              <span className="font-mono font-medium text-slate-800">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-mono font-medium text-slate-800">{pagination.total}</span> records
            </div>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <button
                onClick={() => onFilterChange({ page: Math.max(1, pagination.page - 1) })}
                disabled={pagination.page <= 1}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-2 font-mono tabular-nums text-slate-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => onFilterChange({ page: Math.min(pagination.totalPages, pagination.page + 1) })}
                disabled={pagination.page >= pagination.totalPages}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
