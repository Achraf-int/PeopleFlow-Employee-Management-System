import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
  Mail,
  AlertTriangle,
  X,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Department, Employee } from '../types';

interface DepartmentManagementProps {
  departments: Department[];
  employees: Employee[];
  loading: boolean;
  onAddDepartment: (data: Partial<Department>) => Promise<void>;
  onUpdateDepartment: (id: string, data: Partial<Department>) => Promise<void>;
  onDeleteDepartment: (id: string) => Promise<void>;
  onFilterEmployeesByDept: (departmentId: string) => void;
}

export const DepartmentManagement: React.FC<DepartmentManagementProps> = ({
  departments,
  employees,
  loading,
  onAddDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
  onFilterEmployeesByDept
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    managerName: '',
    managerEmail: '',
    budget: 300000
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Reassignment Warning Modal for Deletion
  const [deleteWarningDept, setDeleteWarningDept] = useState<Department | null>(null);
  const [deleteConfirmDept, setDeleteConfirmDept] = useState<Department | null>(null);

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.managerName.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      managerName: '',
      managerEmail: '',
      budget: 300000
    });
    setErrors({});
    setServerError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description,
      managerName: dept.managerName,
      managerEmail: dept.managerEmail || '',
      budget: dept.budget || 300000
    });
    setErrors({});
    setServerError(null);
    setModalOpen(true);
  };

  const handleDeleteClick = (dept: Department) => {
    const memberCount = employees.filter(e => e.departmentId === dept.id).length;
    if (memberCount > 0) {
      setDeleteWarningDept(dept);
    } else {
      setDeleteConfirmDept(dept);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDept) return;
    try {
      await onDeleteDepartment(deleteConfirmDept.id);
      setDeleteConfirmDept(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete department.');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Department name is required';
    if (!formData.code.trim()) errs.code = 'Department code is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.managerName.trim()) errs.managerName = 'Manager name is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      if (editingDept) {
        await onUpdateDepartment(editingDept.id, formData);
      } else {
        await onAddDepartment(formData);
      }
      setModalOpen(false);
    } catch (err: any) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      }
      setServerError(err.message || 'Failed to save department.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Departments & Functional Units
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structure organization divisions, define team leads, and manage headcount distribution.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments by name, code, or lead..."
            className="w-full pl-10 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono tabular-nums">
          {filteredDepartments.length} Departments
        </span>
      </div>

      {/* Department Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-slate-200 p-5 space-y-3" />
          ))}
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">No departments found</p>
          <p className="text-xs text-slate-500 mt-1">Try a different search query or create a new department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map(dept => {
            const memberCount = employees.filter(e => e.departmentId === dept.id).length;

            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-100 shrink-0">
                        {dept.code}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {dept.name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          Code: {dept.code}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(dept)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Department"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(dept)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Team Lead:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                      {dept.managerName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onFilterEmployeesByDept(dept.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group"
                    >
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span className="font-mono tabular-nums">{memberCount}</span>
                      <span>{memberCount === 1 ? 'employee' : 'employees'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {dept.budget && (
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                        ${(dept.budget / 1000).toFixed(0)}k budget
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Department Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">
                {editingDept ? 'Edit Department' : 'Create New Department'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {serverError && (
                  <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
                    {serverError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Artificial Intelligence"
                      className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    {errors.name && <p className="mt-1 text-[11px] text-rose-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Code (Short) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. AI"
                      className="w-full px-3 py-2 text-xs font-mono bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    {errors.code && <p className="mt-1 text-[11px] text-rose-600">{errors.code}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Key missions, goals, and operational coverage..."
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {errors.description && <p className="mt-1 text-[11px] text-rose-600">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Manager Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      placeholder="e.g. Dr. Aris Thorne"
                      className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    {errors.managerName && <p className="mt-1 text-[11px] text-rose-600">{errors.managerName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Manager Email
                    </label>
                    <input
                      type="email"
                      value={formData.managerEmail}
                      onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                      placeholder="manager@auspify.com"
                      className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Budget (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
                >
                  {submitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>{editingDept ? 'Update Department' : 'Create Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassignment Warning Modal (Triggered when deleting department with employees) */}
      {deleteWarningDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cannot Delete Department
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    <strong>{deleteWarningDept.name}</strong> currently has{' '}
                    <strong className="text-amber-700 font-mono">
                      {employees.filter(e => e.departmentId === deleteWarningDept.id).length} assigned employee(s)
                    </strong>.
                    Per relational database integrity rules, you cannot delete a department that still contains employees.
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Please transfer or reassign these employees to another department before deleting this unit.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setDeleteWarningDept(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  const deptId = deleteWarningDept.id;
                  setDeleteWarningDept(null);
                  onFilterEmployeesByDept(deptId);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                View & Reassign Employees
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Normal Delete Confirmation for Empty Department */}
      {deleteConfirmDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Delete Department?
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Are you sure you want to delete the <strong>{deleteConfirmDept.name}</strong> ({deleteConfirmDept.code}) department? This department has 0 assigned employees.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirmDept(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
              >
                Delete Department
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
