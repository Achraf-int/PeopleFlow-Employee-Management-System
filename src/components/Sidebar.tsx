import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type NavigationPage = 'overview' | 'employees' | 'departments' | 'reports' | 'settings';

interface SidebarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  employeeCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  employeeCount
}) => {
  const navItems = [
    { id: 'overview' as NavigationPage, label: 'Overview', icon: LayoutDashboard },
    { id: 'employees' as NavigationPage, label: 'Employees', icon: Users, badge: employeeCount },
    { id: 'departments' as NavigationPage, label: 'Departments', icon: Building2 },
    { id: 'reports' as NavigationPage, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as NavigationPage, label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-white border-r border-slate-200/90 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                PeopleFlow
              </span>
              <span className="text-[11px] font-medium text-slate-500 mt-1 truncate">
                Auspify Technologies
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        )}

        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-mono tabular-nums ${
                      isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Internship & Project Footer Context */}
      <div className="p-3 border-t border-slate-100">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1">
              <span>SWE Internship</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                REST Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Spring Boot + MySQL Enterprise Specification
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="Spring Boot & MySQL Enterprise Spec">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
