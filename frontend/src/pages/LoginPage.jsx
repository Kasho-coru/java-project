import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowRightLeft,
  Lock,
  User,
  Eye,
  EyeOff,
  Sun,
  Moon,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Button from '../components/common/Button';

export const LoginPage = () => {
  const { login, loading, error: authError } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim()) {
      setFormError('Please enter your username or email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your account password.');
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleSelectDemoAccount = (acc) => {
    setUsername(acc.username);
    setPassword(acc.username === 'admin' ? 'admin123' : `${acc.username}123`);
    setFormError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F5F6F4] dark:bg-[#17232D] text-[#263238] dark:text-[#E7ECEB] relative px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#243541] text-[#77818A] hover:text-[#263238] dark:text-[#A2AFB5] dark:hover:text-[#E7ECEB] transition-colors shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#25364A]" />
          )}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#25364A] to-[#426B72] dark:from-[#426B72] dark:to-[#8DAEAA] flex items-center justify-center text-white shadow-md mb-3">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#25364A] dark:text-[#E7ECEB]">
            TransitionFlow
          </h2>
          <p className="mt-1 text-xs text-[#77818A] dark:text-[#A2AFB5] max-w-xs">
            Employee Responsibility Handover & Transition Management System
          </p>
        </div>

        {/* Main Login Card */}
        <div className="mt-8 bg-white dark:bg-[#243541] py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-[#E5E8E5] dark:border-[#354651]">
          {/* Error Message */}
          {(formError || authError) && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError || authError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5] mb-1.5"
              >
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#77818A]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or sarah"
                  className="block w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] placeholder-[#77818A] focus:outline-none focus:ring-2 focus:ring-[#426B72] dark:focus:ring-[#8DAEAA] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#77818A]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="block w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] placeholder-[#77818A] focus:outline-none focus:ring-2 focus:ring-[#426B72] dark:focus:ring-[#8DAEAA] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#77818A] hover:text-[#263238] dark:hover:text-[#E7ECEB]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-2.5 font-semibold"
              >
                Sign In to System
              </Button>
            </div>
          </form>

          {/* Academic Viva Demo Accounts Fast-Selector */}
          <div className="mt-6 pt-5 border-t border-[#E5E8E5] dark:border-[#354651]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Viva Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleSelectDemoAccount(acc)}
                  className={`p-2 text-left rounded-lg border text-xs transition-all ${
                    username === acc.username
                      ? 'border-[#426B72] bg-[#D7E2DF]/40 dark:bg-[#426B72]/30 dark:border-[#8DAEAA]'
                      : 'border-[#E5E8E5] dark:border-[#354651] hover:bg-slate-50 dark:hover:bg-[#1D2C37]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#263238] dark:text-[#E7ECEB] truncate">
                      {acc.username}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[#77818A]">
                      {acc.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#77818A] dark:text-[#A2AFB5] truncate mt-0.5">
                    {acc.fullName}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-center text-[#77818A] dark:text-[#A2AFB5] mt-3">
              Academic Demonstration • Direct MySQL & REST API Integrated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
