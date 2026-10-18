import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Server,
  RefreshCw,
  Download,
  Building,
  CheckCircle,
  Code2,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { SystemInfo } from '../types';
import { apiService } from '../services/api';
import { useToast } from './Toast';

interface SettingsViewProps {
  onRefreshData: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRefreshData }) => {
  const { success, error } = useToast();
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    apiService.getSystemInfo().then(setSystemInfo).catch(console.error);
  }, []);

  const handleResetData = async () => {
    if (!window.confirm('Reset all employee and department records back to original Auspify seed state?')) {
      return;
    }

    setResetting(true);
    try {
      await apiService.resetSystemData();
      await onRefreshData();
      const updated = await apiService.getSystemInfo();
      setSystemInfo(updated);
      success('Dataset Reset', 'Successfully restored default Auspify Technologies records.');
    } catch (err: any) {
      error('Reset Failed', err.message || 'Could not reset dataset.');
    } finally {
      setResetting(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const [employeesRes, depts] = await Promise.all([
        apiService.getEmployees({ limit: 1000 }),
        apiService.getDepartments()
      ]);

      const backup = {
        organization: 'Auspify Technologies',
        timestamp: new Date().toISOString(),
        version: '1.2.0',
        departments: depts,
        employees: employeesRes.data
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `peopleflow_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      success('Backup Created', 'Downloaded full organizational snapshot as JSON.');
    } catch (err: any) {
      error('Backup Error', err.message || 'Could not generate backup file.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          System Settings & Architecture
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure enterprise organizational parameters and inspect full-stack runtime specifications.
        </p>
      </div>

      {/* Organization Information */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Organization Profile
            </h2>
            <p className="text-xs text-slate-500">
              Auspify Technologies Software Engineering Internship
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Organization Name</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
              Auspify Technologies
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">System Codename</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block font-mono">
              PeopleFlow HR Core
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Primary Headquarters</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              San Francisco, CA (with Distributed Remote Hubs)
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Internship Project Scope</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              Task 4 – Full-Stack Employee Management System
            </span>
          </div>
        </div>
      </div>

      {/* Full-Stack Architecture Specifications */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Backend Architecture & Persistence
            </h2>
            <p className="text-xs text-slate-500">
              Dual-layer enterprise architecture: Spring Boot 3 + MySQL project with synchronized REST API
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">REST API Protocol</span>
            <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              HTTP/1.1 RESTful JSON
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Spring Boot 3.2+ Maven Package</span>
            <span className="font-mono text-slate-800">
              /backend/pom.xml (Java 17, Spring Data JPA)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Database Target</span>
            <span className="font-mono text-slate-800">
              MySQL 8.0 with InnoDB Constraints & Foreign Keys
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Active Database Records</span>
            <span className="font-mono text-slate-800 font-semibold tabular-nums">
              {systemInfo?.recordsCount.employees || 16} Employees · {systemInfo?.recordsCount.departments || 6} Departments
            </span>
          </div>
        </div>

        {/* Quick Instructions to run Spring Boot locally */}
        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400 font-sans text-[11px] font-semibold uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            <span>Local Spring Boot + MySQL Launch Commands (in VS Code)</span>
          </div>
          <p className="text-slate-300"># 1. Spin up MySQL 8 via Docker Compose:</p>
          <p className="text-emerald-400">docker compose up -d mysql</p>
          <p className="text-slate-300 pt-1"># 2. Run Spring Boot backend with Java 17:</p>
          <p className="text-emerald-400">cd backend && mvn spring-boot:run</p>
          <p className="text-slate-300 pt-1"># 3. Backend tests execution:</p>
          <p className="text-emerald-400">mvn test</p>
        </div>
      </div>

      {/* Data Maintenance & Backups */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Data Management & Backup
            </h2>
            <p className="text-xs text-slate-500">
              Restore seed records or export organizational snapshot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <button
            onClick={handleResetData}
            disabled={resetting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset to Auspify Seed Data</span>
          </button>

          <button
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Full JSON Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
