import React from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  Clock,
  Pencil,
  Trash2,
  FileText
} from 'lucide-react';
import { Employee } from '../types';

interface EmployeeDetailDrawerProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeDetailDrawer: React.FC<EmployeeDetailDrawerProps> = ({
  employee,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!employee) return null;

  // Calculate tenure
  const hireDate = new Date(employee.dateHired);
  const today = new Date();
  const diffMonths = (today.getFullYear() - hireDate.getFullYear()) * 12 + (today.getMonth() - hireDate.getMonth());
  const tenureYears = Math.floor(diffMonths / 12);
  const tenureMonths = diffMonths % 12;
  const tenureString =
    tenureYears > 0
      ? `${tenureYears} yr ${tenureMonths} mo`
      : `${tenureMonths} mo`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
              Employee Dossier
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(employee)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit Record"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(employee)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Employee"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Identity Card */}
            <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xl ring-1 ring-indigo-100 shrink-0">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                      employee.employmentStatus === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : employee.employmentStatus === 'On Leave'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {employee.employmentStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {employee.jobTitle}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  ID: {employee.employeeId}
                </p>
              </div>
            </div>

            {/* Employment Parameters */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Employment Parameters
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Department</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {employee.departmentName}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Employment Type</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {employee.employmentType}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Date Hired</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block font-mono">
                    {employee.dateHired}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Calculated Tenure</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block font-mono">
                    {tenureString}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact & Location
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block">Email Address</span>
                    <a
                      href={`mailto:${employee.email}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800 truncate block"
                    >
                      {employee.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Phone Number</span>
                    <span className="font-medium text-slate-800 font-mono">
                      {employee.phone || 'Not specified'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned Location</span>
                    <span className="font-medium text-slate-800">
                      {employee.workLocation || 'San Francisco HQ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {employee.notes && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Internal HR Notes
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  {employee.notes}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => onDelete(employee)}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              Delete Record
            </button>
            <button
              onClick={() => onEdit(employee)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
