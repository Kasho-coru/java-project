import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileSpreadsheet,
  FilePlus2,
  CheckSquare2,
  FolderGit2,
  BarChart3,
  Settings,
  ShieldCheck,
  UserCheck,
  LogOut,
  ArrowRightLeft
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, logout } = useAuth();
  const role = currentUser?.role || 'EMPLOYEE';

  // Role-specific navigation items
  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Employee Directory', path: '/employees', icon: Users },
          { name: 'Department Mgmt', path: '/departments', icon: Building2 },
          { name: 'All Handovers', path: '/handovers', icon: FileSpreadsheet },
          { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
          { name: 'Settings', path: '/settings', icon: Settings },
        ];
      case 'MANAGER':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Employee Directory', path: '/employees', icon: Users },
          { name: 'Approvals & Reviews', path: '/approvals', icon: CheckSquare2 },
          { name: 'All Handovers', path: '/handovers', icon: FileSpreadsheet },
          { name: 'Department Reports', path: '/reports', icon: BarChart3 },
          { name: 'Settings', path: '/settings', icon: Settings },
        ];
      case 'EMPLOYEE':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Create Handover', path: '/handovers/create', icon: FilePlus2 },
          { name: 'My Outgoing', path: '/handovers', icon: FolderGit2 },
          { name: 'My Responsibilities', path: '/my-responsibilities', icon: ArrowRightLeft },
          { name: 'Settings', path: '/settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Admin Workspace', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' };
      case 'MANAGER':
        return { label: 'Manager Workspace', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' };
      default:
        return { label: 'Employee Workspace', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300' };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#1D2C37] border-r border-[#E5E8E5] dark:border-[#354651] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-[#E5E8E5] dark:border-[#354651]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25364A] to-[#426B72] dark:from-[#426B72] dark:to-[#8DAEAA] flex items-center justify-center text-white shadow-sm">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-[#25364A] dark:text-[#E7ECEB]">
              TransitionFlow
            </span>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-[#77818A] dark:text-[#A2AFB5]">
              Handover System
            </div>
          </div>
        </div>

        {/* Current Role Scope Pill */}
        <div className="px-5 pt-4 pb-2">
          <div className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${roleInfo.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{roleInfo.label}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#25364A] text-white dark:bg-[#426B72] dark:text-white shadow-sm'
                      : 'text-[#263238] hover:bg-[#F5F6F4] dark:text-[#E7ECEB] dark:hover:bg-[#243541]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/50 dark:bg-[#17232D]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#426B72] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {currentUser?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#263238] dark:text-[#E7ECEB] truncate">
                  {currentUser?.fullName || 'User'}
                </p>
                <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5] truncate">
                  @{currentUser?.username || 'user'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-[#77818A] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
