import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { Employee, Department, EmploymentType, EmploymentStatus } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: Partial<Employee>) => Promise<void>;
  initialData?: Employee | null;
  departments: Department[];
  nextSuggestedId?: string;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  departments,
  nextSuggestedId = 'EMP-1020'
}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    jobTitle: '',
    employmentType: 'Full-time' as EmploymentType,
    employmentStatus: 'Active' as EmploymentStatus,
    dateHired: new Date().toISOString().slice(0, 10),
    workLocation: 'San Francisco HQ',
    imageUrl: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        employeeId: initialData.employeeId,
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone || '',
        departmentId: initialData.departmentId,
        jobTitle: initialData.jobTitle,
        employmentType: initialData.employmentType,
        employmentStatus: initialData.employmentStatus,
        dateHired: initialData.dateHired,
        workLocation: initialData.workLocation || 'San Francisco HQ',
        imageUrl: initialData.imageUrl || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        employeeId: nextSuggestedId,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        departmentId: departments[0]?.id || '',
        jobTitle: '',
        employmentType: 'Full-time',
        employmentStatus: 'Active',
        dateHired: new Date().toISOString().slice(0, 10),
        workLocation: 'San Francisco HQ',
        imageUrl: '',
        notes: ''
      });
    }
    setErrors({});
    setServerError(null);
  }, [initialData, isOpen, departments, nextSuggestedId]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.employeeId.trim()) errs.employeeId = 'Employee ID is required';
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.departmentId) errs.departmentId = 'Department is required';
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Job title is required';
    if (!formData.dateHired) errs.dateHired = 'Date hired is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      }
      setServerError(err.message || 'Failed to save employee record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEdit ? 'Edit Employee Record' : 'Register New Employee'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? 'Update employee credentials, department, and role.' : 'Add a new member to Auspify Technologies organization.'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {serverError && (
              <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Row 1: Employee ID & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                  placeholder="e.g. EMP-1025"
                  className={`w-full px-3 py-2 text-xs font-mono bg-white text-slate-900 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.employeeId ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                  }`}
                />
                {errors.employeeId && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.employeeId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className={`w-full px-3 py-2 text-xs bg-white text-slate-900 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.departmentId ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                  }`}
                >
                  <option value="">Select a Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.departmentId}</p>
                )}
              </div>
            </div>

            {/* Row 2: First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Mateo"
                  className={`w-full px-3 py-2 text-xs bg-white text-slate-900 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.firstName ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Silva"
                  className={`w-full px-3 py-2 text-xs bg-white text-slate-900 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.lastName ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Row 3: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. mateo.silva@auspify.com"
                  className={`w-full px-3 py-2 text-xs bg-white text-slate-900 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (415) 555-0199"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Row 4: Job Title & Work Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className={`w-full px-3 py-2 text-xs bg-white text-slate-900 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.jobTitle ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                  }`}
                />
                {errors.jobTitle && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.jobTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Location
                </label>
                <input
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                  placeholder="e.g. San Francisco HQ or Remote"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Row 5: Employment Type & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employment Status
                </label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as EmploymentStatus })}
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Row 6: Date Hired & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date Hired <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateHired}
                  onChange={(e) => setFormData({ ...formData, dateHired: e.target.value })}
                  className={`w-full px-3 py-2 text-xs bg-white text-slate-900 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.dateHired ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                  }`}
                />
                {errors.dateHired && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.dateHired}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional team/project assignment note"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isEdit ? 'Save Changes' : 'Register Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
