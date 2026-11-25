import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import {
  BarChart3,
  Printer,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  Download
} from 'lucide-react';
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
  Cell,
  LineChart,
  Line
} from 'recharts';

export const ReportsPage = () => {
  const [summary, setSummary] = useState({
    totalHandovers: 14,
    completedHandovers: 8,
    pendingHandovers: 5,
    rejectedHandovers: 1,
    avgCompletionDays: 11.4
  });

  const [departmentData, setDepartmentData] = useState([
    { name: 'Engineering', total: 7, completed: 4, pending: 3 },
    { name: 'Product', total: 4, completed: 2, pending: 2 },
    { name: 'Operations', total: 2, completed: 2, pending: 0 },
    { name: 'Finance', total: 1, completed: 0, pending: 1 }
  ]);

  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jun', handovers: 2 },
    { month: 'Jul', handovers: 3 },
    { month: 'Aug', handovers: 4 },
    { month: 'Sep', handovers: 6 },
    { month: 'Oct', handovers: 14 }
  ]);

  const statusData = [
    { name: 'Completed', value: 8, color: '#10B981' },
    { name: 'Pending Review', value: 3, color: '#F59E0B' },
    { name: 'Pending Receiver', value: 2, color: '#0EA5E9' },
    { name: 'Clarification / Rejected', value: 1, color: '#F43F5E' }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const sumRes = await reportService.getSummary();
        if (sumRes?.data) setSummary(sumRes.data);
        const deptRes = await reportService.getDepartments();
        if (deptRes?.data) setDepartmentData(deptRes.data);
        const monRes = await reportService.getMonthly();
        if (monRes?.data) setMonthlyData(monRes.data);
      } catch {
        // Fallback demo metrics
      }
    };
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header with Print action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#263238] dark:text-[#E7ECEB]">
            Handover Analytics & Executive Reports
          </h2>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Aggregate performance indicators, department throughput, and compliance auditing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Initiated"
          value={summary.totalHandovers}
          subtitle="All recorded transfers"
          icon={FileSpreadsheet}
          color="navy"
        />
        <StatCard
          title="Completed Rate"
          value={`${Math.round((summary.completedHandovers / (summary.totalHandovers || 1)) * 100)}%`}
          subtitle="Successfully closed"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Active in Flight"
          value={summary.pendingHandovers}
          subtitle="Awaiting actions"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Rejected / Clarified"
          value={summary.rejectedHandovers}
          subtitle="Required revisions"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Avg Transition Time"
          value={`${summary.avgCompletionDays} Days`}
          subtitle="Creation to closure"
          icon={Calendar}
          color="teal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Comparison Chart */}
        <Card
          title="Department Handover Volumes"
          subtitle="Completed vs Active in-flight handovers by division"
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
                <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="In Progress" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trend Line Chart */}
        <Card
          title="Monthly Handover Activity Trend"
          subtitle="Volume of responsibility transfers initiated over time"
        >
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8DAEAA" strokeOpacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#77818A' }} />
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
                <Line
                  type="monotone"
                  dataKey="handovers"
                  stroke="#426B72"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#25364A' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Audit Summary Table */}
      <Card title="Department Compliance & SLA Audit Table" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E8E5] dark:border-[#354651] text-[11px] uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5] bg-[#F5F6F4]/50 dark:bg-[#1D2C37]/30">
                <th className="py-3 px-4 font-semibold">Department Division</th>
                <th className="py-3 px-4 font-semibold">Total Transfers</th>
                <th className="py-3 px-4 font-semibold">Completed Transfers</th>
                <th className="py-3 px-4 font-semibold">In Progress</th>
                <th className="py-3 px-4 font-semibold">Completion %</th>
                <th className="py-3 px-4 font-semibold">Status Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E8E5] dark:divide-[#354651] text-xs">
              {departmentData.map((d, idx) => {
                const percent = Math.round((d.completed / (d.total || 1)) * 100);
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#1D2C37]/40">
                    <td className="py-3 px-4 font-semibold text-[#263238] dark:text-[#E7ECEB]">
                      {d.name}
                    </td>
                    <td className="py-3 px-4 font-bold">{d.total}</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {d.completed}
                    </td>
                    <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-semibold">
                      {d.pending}
                    </td>
                    <td className="py-3 px-4 font-semibold">{percent}%</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        percent >= 70
                          ? 'bg-emerald-100 text-emerald-800'
                          : percent >= 40
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {percent >= 70 ? 'HEALTHY' : percent >= 40 ? 'MODERATE' : 'ATTENTION'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
