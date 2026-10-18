import React from 'react';
import {
  Users,
  UserCheck,
  Building2,
  CalendarClock,
  UserPlus,
  FolderPlus,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { DashboardStats, Employee } from '../types';
import { NavigationPage } from './Sidebar';

interface OverviewDashboardProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigate: (page: NavigationPage) => void;
  onOpenAddEmployee: () => void;
  onOpenAddDepartment: () => void;
  onSelectEmployee: (employee: Employee) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  loading,
  onNavigate,
  onOpenAddEmployee,
  onOpenAddDepartment,
  onSelectEmployee
}) => {
  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* KPI Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl" />
              <div className="w-24 h-6 bg-slate-100 rounded" />
              <div className="w-16 h-4 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-white rounded-2xl border border-slate-200/80 p-6" />
          <div className="h-72 bg-white rounded-2xl border border-slate-200/80 p-6" />
        </div>
      </div>
    );
  }

  const {
    totalEmployees,
    activeEmployees,
    totalDepartments,
    onLeaveEmployees,
    departmentDistribution,
    statusDistribution,
    recentEmployees,
    recentActivities
  } = stats;

  const activeRate = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;
  const avgTeamSize = totalDepartments > 0 ? (totalEmployees / totalDepartments).toFixed(1) : '0';

  // Find max count for department bars
  const maxDeptCount = Math.max(...departmentDistribution.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Workforce Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time organizational analytics and staffing health for Auspify Technologies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenAddEmployee}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
          <button
            onClick={onOpenAddDepartment}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-slate-500" />
            <span>Add Department</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Employees */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Employees
            </span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalEmployees}
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              100% Persisted
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Across {totalDepartments} active functional units
          </p>
        </div>

        {/* KPI 2: Active Employees */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Headcount
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {activeEmployees}
            </span>
            <span className="text-xs font-mono font-medium text-slate-500 tabular-nums">
              ({activeRate}% capacity)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Currently on active operational duty
          </p>
        </div>

        {/* KPI 3: Total Departments */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Departments
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalDepartments}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ~{avgTeamSize} per dept
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Structured business departments
          </p>
        </div>

        {/* KPI 4: Employees On Leave */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              On Leave
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <CalendarClock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {onLeaveEmployees}
            </span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Approved
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Parental, medical, or PTO status
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Headcount by Department Bar Chart */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Department Headcount Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff allocation across functional business units
              </p>
            </div>
            <button
              onClick={() => onNavigate('departments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {departmentDistribution.map(dept => {
              const widthPct = Math.max(8, Math.round((dept.count / maxDeptCount) * 100));
              return (
                <div key={dept.departmentId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">
                      {dept.departmentName}
                    </span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {dept.count} {dept.count === 1 ? 'member' : 'members'} · {dept.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employment Status Distribution Ring Chart */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Employment Status
              </h2>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {totalEmployees} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Active staffing vs leaves and transitions
            </p>

            {/* Circular representation */}
            <div className="relative flex items-center justify-center my-4">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100 fill-none"
                  strokeWidth="10"
                />
                {/* Active Ring Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-emerald-500 fill-none transition-all duration-500"
                  strokeWidth="10"
                  strokeDasharray={`${activeRate * 2.38} 238`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {activeRate}%
                </span>
                <span className="text-[11px] font-medium text-slate-500">Active</span>
              </div>
            </div>
          </div>

          {/* Status Breakdown Legend */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            {statusDistribution.map(st => {
              const color =
                st.status === 'Active'
                  ? 'bg-emerald-500'
                  : st.status === 'On Leave'
                  ? 'bg-amber-500'
                  : 'bg-slate-400';

              return (
                <div key={st.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-slate-700 font-medium">{st.status}</span>
                  </div>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {st.count} ({st.percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added Employees Table */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recently Added Employees
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest additions to the Auspify Technologies talent roster
              </p>
            </div>
            <button
              onClick={() => onNavigate('employees')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 pr-4">Employee</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Job Title</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs ring-1 ring-slate-200">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">
                            {emp.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {emp.departmentName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {emp.jobTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-md ${
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
                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => onSelectEmployee(emp)}
                        className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Audit & Activity Log
            </h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Chronological system modifications & updates
          </p>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-80 pr-1">
            {recentActivities.map(act => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900 truncate">
                      {act.title}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {act.description}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    By {act.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
