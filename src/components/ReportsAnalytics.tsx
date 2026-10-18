import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  BarChart,
  Calendar,
  Users,
  CheckCircle,
  Briefcase,
  Layers,
  ArrowDownToLine
} from 'lucide-react';
import { Department, Employee, ReportFilter } from '../types';
import { apiService } from '../services/api';
import { useToast } from './Toast';

interface ReportsAnalyticsProps {
  departments: Department[];
  employees: Employee[];
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({
  departments,
  employees
}) => {
  const { success, error } = useToast();
  const [filters, setFilters] = useState<ReportFilter>({
    departmentId: 'ALL',
    status: 'ALL',
    employmentType: 'ALL',
    startDate: '',
    endDate: ''
  });

  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await apiService.getReports(filters);
      setReportData(data);
    } catch (err: any) {
      error('Report Load Error', err.message || 'Failed to load report analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      await apiService.exportEmployeesCsv();
      success('CSV Export Generated', 'Downloaded peopleflow_employees_export.csv successfully.');
    } catch (err: any) {
      error('Export Failed', err.message || 'Could not export employee data.');
    } finally {
      setExporting(false);
    }
  };

  const filteredEmployees: Employee[] = reportData?.filteredRecords || employees;
  const totalHeadcount = filteredEmployees.length;

  // Department Breakdown
  const deptBreakdown = departments.map(d => {
    const count = filteredEmployees.filter(e => e.departmentId === d.id).length;
    return {
      id: d.id,
      name: d.name,
      code: d.code,
      count,
      pct: totalHeadcount > 0 ? Math.round((count / totalHeadcount) * 100) : 0
    };
  });

  // Employment Type Breakdown
  const types = ['Full-time', 'Part-time', 'Contract', 'Intern'] as const;
  const typeBreakdown = types.map(t => {
    const count = filteredEmployees.filter(e => e.employmentType === t).length;
    return {
      type: t,
      count,
      pct: totalHeadcount > 0 ? Math.round((count / totalHeadcount) * 100) : 0
    };
  });

  // Status Breakdown
  const statuses = ['Active', 'On Leave', 'Inactive'] as const;
  const statusBreakdown = statuses.map(s => {
    const count = filteredEmployees.filter(e => e.employmentStatus === s).length;
    return {
      status: s,
      count,
      pct: totalHeadcount > 0 ? Math.round((count / totalHeadcount) * 100) : 0
    };
  });

  const monthlyTrends: { month: string; hires: number }[] = reportData?.monthlyTrends || [];
  const maxHires = Math.max(...monthlyTrends.map(m => m.hires), 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Workforce Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit staffing trends, department allocations, and export comprehensive CSV data.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          {exporting ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowDownToLine className="w-4 h-4" />
          )}
          <span>Export Employee Records (.CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Report Parameters & Date Range</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Department
            </label>
            <select
              value={filters.departmentId}
              onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              From Hire Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
            </input>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              To Hire Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
            </input>
          </div>
        </div>

        {(filters.departmentId !== 'ALL' || filters.status !== 'ALL' || filters.startDate || filters.endDate) && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Active filter matching: <strong className="text-slate-800 font-mono tabular-nums">{totalHeadcount}</strong> employees
            </span>
            <button
              onClick={() => setFilters({ departmentId: 'ALL', status: 'ALL', employmentType: 'ALL', startDate: '', endDate: '' })}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset report filters
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total In Report
          </span>
          <p className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalHeadcount}
          </p>
          <span className="text-[11px] text-slate-500">Matching criteria</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Active Staff
          </span>
          <p className="mt-1 text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {filteredEmployees.filter(e => e.employmentStatus === 'Active').length}
          </p>
          <span className="text-[11px] text-slate-500">Deployable personnel</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            On Leave
          </span>
          <p className="mt-1 text-2xl font-bold text-amber-600 font-mono tabular-nums">
            {filteredEmployees.filter(e => e.employmentStatus === 'On Leave').length}
          </p>
          <span className="text-[11px] text-slate-500">Scheduled returns</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Full-time Ratio
          </span>
          <p className="mt-1 text-2xl font-bold text-indigo-600 font-mono tabular-nums">
            {totalHeadcount > 0
              ? `${Math.round((filteredEmployees.filter(e => e.employmentType === 'Full-time').length / totalHeadcount) * 100)}%`
              : '0%'}
          </p>
          <span className="text-[11px] text-slate-500">Core staff base</span>
        </div>
      </div>

      {/* Hiring Trends by Month */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Hiring Trends by Month
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical onboarding trajectory across Auspify Technologies
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Monthly Hires
          </span>
        </div>

        {monthlyTrends.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No hiring records match date scope.
          </div>
        ) : (
          <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-slate-100 overflow-x-auto">
            {monthlyTrends.map(item => {
              const heightPct = Math.max(15, Math.round((item.hires / maxHires) * 100));
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 min-w-[50px] group">
                  <span className="text-[11px] font-mono text-slate-600 font-semibold tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hires}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-indigo-500 hover:bg-indigo-600 rounded-t-lg transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-500 truncate">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Distribution Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Department Headcount */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Headcount by Department
          </h3>
          <div className="space-y-3">
            {deptBreakdown.map(d => (
              <div key={d.id} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">{d.name}</span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {d.count} ({d.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employment Type */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Employment Type Mix
          </h3>
          <div className="space-y-3">
            {typeBreakdown.map(t => (
              <div key={t.type} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">{t.type}</span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {t.count} ({t.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employment Status */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Operational Status
          </h3>
          <div className="space-y-3">
            {statusBreakdown.map(s => {
              const barColor =
                s.status === 'Active' ? 'bg-emerald-500' : s.status === 'On Leave' ? 'bg-amber-500' : 'bg-slate-400';
              return (
                <div key={s.status} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-700">{s.status}</span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {s.count} ({s.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
