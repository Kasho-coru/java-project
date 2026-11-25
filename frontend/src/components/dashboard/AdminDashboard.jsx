import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  TrendingUp,
  UserPlus,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { HANDOVER_STATUS_CONFIG, formatDate } from '../../utils/statusConfig';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard = ({ stats }) => {
  const navigate = useNavigate();

  // Fallback data for demonstration if stats from API are loading or empty
  const summary = stats?.summary || {
    totalEmployees: 24,
    totalDepartments: 6,
    totalHandovers: 14,
    pendingHandovers: 5,
    completedHandovers: 8,
  };

  const departmentData = stats?.departmentDistribution || [
    { name: 'Engineering', count: 6 },
    { name: 'Product', count: 3 },
    { name: 'Operations', count: 2 },
    { name: 'Finance', count: 2 },
    { name: 'Marketing', count: 1 },
  ];

  const statusData = stats?.statusDistribution || [
    { name: 'Completed', value: 8, color: '#10B981' },
    { name: 'Pending Mgr', value: 3, color: '#F59E0B' },
    { name: 'Pending Recv', value: 2, color: '#0EA5E9' },
    { name: 'Clarification', value: 1, color: '#F97316' },
  ];

  const recentHandovers = stats?.recentHandovers || [
    {
      id: 1,
      handoverCode: 'HO-2026-001',
      fromEmployeeName: 'Sarah Jenkins',
      toEmployeeName: 'David Kim',
      departmentName: 'Engineering',
      reason: 'RESIGNATION',
      status: 'PENDING_MANAGER',
      lastWorkingDate: '2026-11-15'
    },
    {
      id: 2,
      handoverCode: 'HO-2026-002',
      fromEmployeeName: 'Michael Chang',
      toEmployeeName: 'Elena Rostova',
      departmentName: 'Product',
      reason: 'DEPARTMENT_TRANSFER',
      status: 'PENDING_RECEIVER',
      lastWorkingDate: '2026-11-08'
    },
    {
      id: 3,
      handoverCode: 'HO-2026-003',
      fromEmployeeName: 'Amara Okafor',
      toEmployeeName: 'Liam Vance',
      departmentName: 'Operations',
      reason: 'EXTENDED_LEAVE',
      status: 'COMPLETED',
      lastWorkingDate: '2026-10-25'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Staff"
          value={summary.totalEmployees}
          subtitle="Across active units"
          icon={Users}
          color="navy"
        />
        <StatCard
          title="Departments"
          value={summary.totalDepartments}
          subtitle="Configured divisions"
          icon={Building2}
          color="teal"
        />
        <StatCard
          title="Total Handovers"
          value={summary.totalHandovers}
          subtitle="All recorded transfers"
          icon={FileSpreadsheet}
          color="sky"
        />
        <StatCard
          title="In Progress"
          value={summary.pendingHandovers}
          subtitle="Awaiting actions"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={summary.completedHandovers}
          subtitle="Seamlessly closed"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution Bar Chart */}
        <Card
          title="Handovers by Department"
          subtitle="Workforce transitions across functional teams"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8DAEAA" strokeOpacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#77818A' }} />
                <YAxis tick={{ fontSize: 12, fill: '#77818A' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#25364A',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#426B72" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card
          title="Status Breakdown"
          subtitle="Active pipeline states"
        >
          <div className="h-64 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-xs w-full px-2 mt-2">
              {statusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#77818A] dark:text-[#A2AFB5] truncate">{item.name}</span>
                  <span className="font-semibold text-[#263238] dark:text-[#E7ECEB] ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Handover Records & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Recent Transitions"
          subtitle="Latest organizational handover submissions"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/handovers')}>
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
          className="lg:col-span-2"
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E8E5] dark:border-[#354651] text-[11px] uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5] bg-[#F5F6F4]/50 dark:bg-[#1D2C37]/30">
                  <th className="py-3 px-4 font-semibold">Code</th>
                  <th className="py-3 px-4 font-semibold">Outgoing & Receiver</th>
                  <th className="py-3 px-4 font-semibold">Dept</th>
                  <th className="py-3 px-4 font-semibold">Last Day</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8E5] dark:divide-[#354651] text-xs">
                {recentHandovers.map((row) => {
                  const statusConf = HANDOVER_STATUS_CONFIG[row.status] || HANDOVER_STATUS_CONFIG.DRAFT;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/handovers/${row.id}`)}
                      className="hover:bg-slate-50 dark:hover:bg-[#1D2C37]/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-[#25364A] dark:text-[#8DAEAA]">
                        {row.handoverCode}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-[#263238] dark:text-[#E7ECEB]">
                          {row.fromEmployeeName}
                        </span>
                        <span className="text-[#77818A] dark:text-[#A2AFB5] mx-1">→</span>
                        <span className="text-[#263238] dark:text-[#E7ECEB]">
                          {row.toEmployeeName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#77818A] dark:text-[#A2AFB5]">
                        {row.departmentName}
                      </td>
                      <td className="py-3 px-4 text-[#77818A] dark:text-[#A2AFB5]">
                        {formatDate(row.lastWorkingDate)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusConf.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                          {statusConf.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Admin Actions */}
        <Card title="Quick Actions" subtitle="System shortcuts">
          <div className="space-y-3">
            <button
              onClick={() => navigate('/employees')}
              className="w-full flex items-center justify-between p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] hover:bg-slate-50 dark:hover:bg-[#1D2C37] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#263238] dark:text-[#E7ECEB]">
                    Manage Employees
                  </h4>
                  <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5]">
                    Add staff, designations & logins
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#77818A]" />
            </button>

            <button
              onClick={() => navigate('/departments')}
              className="w-full flex items-center justify-between p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] hover:bg-slate-50 dark:hover:bg-[#1D2C37] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-[#426B72] dark:text-[#8DAEAA]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#263238] dark:text-[#E7ECEB]">
                    Department Units
                  </h4>
                  <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5]">
                    Assign managers and team divisions
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#77818A]" />
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="w-full flex items-center justify-between p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] hover:bg-slate-50 dark:hover:bg-[#1D2C37] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#263238] dark:text-[#E7ECEB]">
                    Generate Reports
                  </h4>
                  <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5]">
                    Export transition audits & metrics
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#77818A]" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
