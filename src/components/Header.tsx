import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Check, User, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { NavigationPage } from './Sidebar';

// Generated HR Lead Avatar
import hrLeadAvatar from '../assets/images/avatar_hr_lead_1792321190206.jpg';

interface HeaderProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onOpenAddEmployee: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onSearchChange,
  searchQuery,
  onOpenAddEmployee
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Quarterly HR Audit',
      time: '10 min ago',
      read: false,
      description: 'Department headcounts are verified and synced with payroll.'
    },
    {
      id: 2,
      title: 'New Intern Registered',
      time: '2 hours ago',
      read: false,
      description: 'Mateo Silva joined Engineering as Software Engineering Intern.'
    },
    {
      id: 3,
      title: 'Upcoming Leave Reminder',
      time: '1 day ago',
      read: true,
      description: 'Carlos Mendoza is scheduled for leave starting next week.'
    }
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getPageTitle = (page: NavigationPage) => {
    switch (page) {
      case 'overview': return 'Overview Dashboard';
      case 'employees': return 'Employee Directory';
      case 'departments': return 'Departments & Organization';
      case 'reports': return 'Reports & Analytics';
      case 'settings': return 'System Settings';
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 gap-6">
      {/* Zone 1: Breadcrumb & Current Context */}
      <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
        <span className="font-medium text-slate-500 hover:text-slate-800 transition-colors">
          PeopleFlow
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-900 truncate">
          {getPageTitle(activePage)}
        </span>
      </div>

      {/* Zone 2: Global Search Input */}
      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search employees, titles, or departments..."
            className="w-full pl-10 pr-12 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            /
          </kbd>
        </div>
      </div>

      {/* Zone 3: Actions, Notifications & Profile Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Add Employee Action */}
        <button
          onClick={onOpenAddEmployee}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
        >
          <span>Add Employee</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-slate-50 transition-colors ${
                      !n.read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {n.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
            title="User Profile Menu"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200">
              <img
                src={hrLeadAvatar}
                alt="Sarah Chen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback container if local image fails
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <div className="w-full h-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                SC
              </div>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">Sarah Chen</span>
              <span className="text-[11px] text-slate-500 leading-tight">Head of HR</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-semibold text-slate-900">Sarah Chen</p>
                <p className="text-[11px] text-slate-500 truncate">sarah.chen@auspify.com</p>
                <span className="inline-block mt-1 text-[10px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Auspify Administrator
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Security & Access
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  System Documentation
                </button>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Session active in Auspify enterprise sandbox environment.');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
