import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {
  User,
  Sun,
  Moon,
  Bell,
  Database,
  Server,
  Layers,
  Code2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-[#263238] dark:text-[#E7ECEB]">
          System Settings & Profile
        </h2>
        <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
          Manage your account profile, UI preferences, and view deployment architecture specifications.
        </p>
      </div>

      {/* User Profile Overview */}
      <Card title="Current Profile Information" subtitle="Authenticated session details">
        <div className="flex items-center gap-4 pb-4 border-b border-[#E5E8E5] dark:border-[#354651]">
          <div className="w-14 h-14 rounded-full bg-[#25364A] text-white flex items-center justify-center font-bold text-lg">
            {currentUser?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#263238] dark:text-[#E7ECEB]">
              {currentUser?.fullName}
            </h3>
            <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
              @{currentUser?.username} • {currentUser?.email}
            </p>
            <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              Role: {currentUser?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
          <div>
            <span className="text-[#77818A] block">Assigned Designation:</span>
            <span className="font-semibold text-[#263238] dark:text-[#E7ECEB]">
              {currentUser?.designation || 'System Executive'}
            </span>
          </div>
          <div>
            <span className="text-[#77818A] block">Department Unit:</span>
            <span className="font-semibold text-[#263238] dark:text-[#E7ECEB]">
              {currentUser?.department || 'Administration'}
            </span>
          </div>
        </div>
      </Card>

      {/* Appearance & Themes */}
      <Card title="Theme & Display Preferences" subtitle="Custom Enterprise color palette">
        <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/50 dark:bg-[#1D2C37]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#426B72]/15 text-[#426B72] dark:text-[#8DAEAA]">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#263238] dark:text-[#E7ECEB]">
                Active Theme: {theme === 'dark' ? 'Dark Sapphire (#17232D)' : 'Light Sand (#F5F6F4)'}
              </h4>
              <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5]">
                Switch between high-contrast light and dark enterprise modes
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Toggle Theme
          </Button>
        </div>
      </Card>

      {/* Academic Project & Architecture Stack Info (Ideal for Viva!) */}
      <Card title="Academic Architecture Specifications" subtitle="Full-stack technology reference for project viva">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/30 dark:bg-[#1D2C37]/30 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#25364A] dark:text-[#8DAEAA]">
              <Code2 className="w-4 h-4" />
              <span>Frontend Architecture</span>
            </div>
            <p className="text-[#77818A] dark:text-[#A2AFB5] text-[11px]">
              React 18, Vite 5, JavaScript (Pure ES6+), Tailwind CSS v3, React Router v6, Axios, Recharts, Lucide Icons.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/30 dark:bg-[#1D2C37]/30 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#426B72] dark:text-[#8DAEAA]">
              <Server className="w-4 h-4" />
              <span>Backend Architecture</span>
            </div>
            <p className="text-[#77818A] dark:text-[#A2AFB5] text-[11px]">
              Java 21, Spring Boot 3.x, Spring Data JPA, Hibernate, Maven Wrapper (`mvnw`), Layered REST APIs.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/30 dark:bg-[#1D2C37]/30 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
              <Database className="w-4 h-4" />
              <span>Relational Database</span>
            </div>
            <p className="text-[#77818A] dark:text-[#A2AFB5] text-[11px]">
              MySQL Server (`employee_handover`), InnoDB Foreign Keys, Normalized DDL schema and seed records.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/30 dark:bg-[#1D2C37]/30 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Authentication Model</span>
            </div>
            <p className="text-[#77818A] dark:text-[#A2AFB5] text-[11px]">
              Simple Academic Authentication (direct MySQL credentials verification, React AuthContext session).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
