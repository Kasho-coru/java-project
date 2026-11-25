import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const TopNavbar = ({ onOpenMobileSidebar }) => {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Compute title based on route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/dashboard') return { title: 'Dashboard Overview', breadcrumb: 'Workspace / Overview' };
    if (path === '/employees') return { title: 'Employee Directory', breadcrumb: 'HR / Employees' };
    if (path === '/departments') return { title: 'Department Management', breadcrumb: 'HR / Departments' };
    if (path === '/handovers/create') return { title: 'Initiate Handover Request', breadcrumb: 'Handovers / New Request' };
    if (path.startsWith('/handovers/')) return { title: 'Handover Transition Details', breadcrumb: 'Handovers / Inspection' };
    if (path === '/handovers') return { title: 'Handover Transitions', breadcrumb: 'Transitions / Registry' };
    if (path === '/approvals') return { title: 'Manager Approvals & Reviews', breadcrumb: 'Management / Approvals' };
    if (path === '/my-responsibilities') return { title: 'Incoming Responsibilities', breadcrumb: 'Tasks / Acceptance' };
    if (path === '/reports') return { title: 'Reports & Analytics', breadcrumb: 'Analytics / Metrics' };
    if (path === '/settings') return { title: 'Application Settings', breadcrumb: 'System / Configuration' };
    return { title: 'Handover System', breadcrumb: 'TransitionFlow' };
  };

  const pageInfo = getPageInfo();

  // Quick account switch helper for demonstration/testing
  const handleQuickSwitch = (account) => {
    setCurrentUser(account);
    setShowProfileMenu(false);
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#1D2C37]/90 backdrop-blur-md border-b border-[#E5E8E5] dark:border-[#354651] flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-[#77818A] hover:text-[#263238] hover:bg-slate-100 dark:hover:bg-[#243541] dark:text-[#A2AFB5] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#263238] dark:text-[#E7ECEB] leading-tight">
            {pageInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-[#77818A] dark:text-[#A2AFB5]">
            {pageInfo.breadcrumb}
          </p>
        </div>
      </div>

      {/* Right: Actions, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-2 rounded-lg text-[#77818A] hover:text-[#263238] hover:bg-slate-100 dark:hover:bg-[#243541] dark:text-[#A2AFB5] dark:hover:text-[#E7ECEB] transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#25364A]" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-lg text-[#77818A] hover:text-[#263238] hover:bg-slate-100 dark:hover:bg-[#243541] dark:text-[#A2AFB5] dark:hover:text-[#E7ECEB] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#1D2C37]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#243541] rounded-xl shadow-xl border border-[#E5E8E5] dark:border-[#354651] py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-[#E5E8E5] dark:border-[#354651] flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5]">
                  Notifications
                </span>
                <span className="text-[11px] text-[#426B72] dark:text-[#8DAEAA] font-medium">
                  3 unread
                </span>
              </div>
              <div className="divide-y divide-[#E5E8E5] dark:divide-[#354651] max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#1D2C37]/50 transition-colors cursor-pointer">
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-[#263238] dark:text-[#E7ECEB]">
                        Handover #HO-2026-001 Approved
                      </p>
                      <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5] mt-0.5">
                        Manager approved transition for Sarah Jenkins.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#1D2C37]/50 transition-colors cursor-pointer">
                  <div className="flex gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-[#263238] dark:text-[#E7ECEB]">
                        Review Pending: Cloud Migration
                      </p>
                      <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5] mt-0.5">
                        Due in 2 days for Receiver David Kim.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] hover:bg-slate-50 dark:hover:bg-[#243541] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#25364A] text-white flex items-center justify-center text-xs font-semibold">
              {currentUser?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-xs font-semibold text-[#263238] dark:text-[#E7ECEB]">
                {currentUser?.fullName || 'User'}
              </span>
              <span className="block text-[10px] text-[#77818A] dark:text-[#A2AFB5] uppercase">
                {currentUser?.role || 'Guest'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#77818A] dark:text-[#A2AFB5]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#243541] rounded-xl shadow-xl border border-[#E5E8E5] dark:border-[#354651] py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-[#E5E8E5] dark:border-[#354651]">
                <p className="text-xs font-semibold text-[#263238] dark:text-[#E7ECEB]">
                  {currentUser?.fullName}
                </p>
                <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5] truncate">
                  {currentUser?.email}
                </p>
              </div>

              {/* Viva Quick Role Switcher */}
              <div className="px-3 py-2 border-b border-[#E5E8E5] dark:border-[#354651]">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#77818A] dark:text-[#A2AFB5] mb-1.5">
                  Demo Role Switch (For Viva)
                </span>
                <div className="space-y-1">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.username}
                      onClick={() => handleQuickSwitch(acc)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between ${
                        currentUser?.username === acc.username
                          ? 'bg-[#25364A] text-white dark:bg-[#426B72]'
                          : 'hover:bg-slate-100 dark:hover:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]'
                      }`}
                    >
                      <span className="font-medium">{acc.fullName}</span>
                      <span className="text-[10px] uppercase opacity-75">{acc.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#263238] dark:text-[#E7ECEB] hover:bg-slate-100 dark:hover:bg-[#1D2C37] rounded-lg transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile & Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
