import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FilePlus2,
  Calendar,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { HANDOVER_STATUS_CONFIG, formatDate } from '../../utils/statusConfig';

export const EmployeeDashboard = ({ stats, currentUser }) => {
  const navigate = useNavigate();

  const summary = stats?.summary || {
    myOutgoingCount: 1,
    incomingHandoversCount: 1,
    pendingResponsibilities: 3,
    completedResponsibilities: 1,
  };

  const activeOutgoing = stats?.activeOutgoing || {
    id: 1,
    handoverCode: 'HO-2026-001',
    toEmployeeName: 'David Kim',
    toEmployeeDesignation: 'Software Engineer',
    departmentName: 'Engineering',
    reason: 'RESIGNATION',
    status: 'PENDING_MANAGER',
    lastWorkingDate: '2026-11-15',
    tasksTotal: 4,
    tasksCompleted: 1
  };

  const incomingTasks = stats?.incomingTasks || [
    {
      id: 101,
      title: 'Review Production VPC Security Groups & IAM Keys',
      from: 'Sarah Jenkins',
      priority: 'HIGH',
      dueDate: '2026-11-05',
      taskStatus: 'PENDING'
    },
    {
      id: 102,
      title: 'Transfer CI/CD Pipeline Maintenance Ownership',
      from: 'Sarah Jenkins',
      priority: 'MEDIUM',
      dueDate: '2026-11-10',
      taskStatus: 'IN_PROGRESS'
    }
  ];

  // Stage steps for workflow status progress bar
  const getWorkflowStep = (status) => {
    switch (status) {
      case 'DRAFT':
        return 1;
      case 'PENDING_MANAGER':
        return 2;
      case 'PENDING_RECEIVER':
      case 'CLARIFICATION_REQUESTED':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getWorkflowStep(activeOutgoing?.status);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Outgoing Handovers"
          value={summary.myOutgoingCount}
          subtitle="Initiated by you"
          icon={FileText}
          color="navy"
        />
        <StatCard
          title="Incoming Handovers"
          value={summary.incomingHandoversCount}
          subtitle="Assigned to you as successor"
          icon={ArrowRightLeft}
          color="teal"
        />
        <StatCard
          title="Pending Responsibilities"
          value={summary.pendingResponsibilities}
          subtitle="Awaiting transfer/completion"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed Tasks"
          value={summary.completedResponsibilities}
          subtitle="Signed off items"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Main Grid: Active Handover Status & Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outgoing Handover Workflow Progress Card */}
        <Card
          title="Active Transition Workflow"
          subtitle="Real-time approval & transfer progress"
          action={
            activeOutgoing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/handovers/${activeOutgoing.id}`)}
              >
                View Details
              </Button>
            ) : null
          }
          className="lg:col-span-2"
        >
          {activeOutgoing ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-[#F5F6F4] dark:bg-[#1D2C37]/60 border border-[#E5E8E5] dark:border-[#354651]">
                <div>
                  <span className="font-mono text-xs font-bold text-[#25364A] dark:text-[#8DAEAA]">
                    {activeOutgoing.handoverCode}
                  </span>
                  <p className="text-sm font-semibold text-[#263238] dark:text-[#E7ECEB]">
                    Handover to {activeOutgoing.toEmployeeName} ({activeOutgoing.toEmployeeDesignation})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#77818A] dark:text-[#A2AFB5] block">
                    Last Working Day
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {formatDate(activeOutgoing.lastWorkingDate)}
                  </span>
                </div>
              </div>

              {/* Multi-step Workflow Timeline Indicator */}
              <div className="pt-2 pb-1">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className={`p-2 rounded-lg border ${
                    currentStep >= 1 ? 'border-[#426B72] bg-[#D7E2DF]/40 text-[#25364A] dark:bg-[#426B72]/30 dark:text-[#E7ECEB]' : 'border-slate-200 text-slate-400'
                  }`}>
                    <span className="font-bold block">1. Draft</span>
                    <span className="text-[10px] hidden sm:block">Tasks Prepared</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${
                    currentStep >= 2 ? 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200' : 'border-slate-200 text-slate-400'
                  }`}>
                    <span className="font-bold block">2. Manager</span>
                    <span className="text-[10px] hidden sm:block">Approval Pending</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${
                    currentStep >= 3 ? 'border-sky-400 bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200' : 'border-slate-200 text-slate-400'
                  }`}>
                    <span className="font-bold block">3. Receiver</span>
                    <span className="text-[10px] hidden sm:block">Review & Confirm</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${
                    currentStep >= 4 ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200' : 'border-slate-200 text-slate-400'
                  }`}>
                    <span className="font-bold block">4. Closed</span>
                    <span className="text-[10px] hidden sm:block">100% Finalized</span>
                  </div>
                </div>
              </div>

              {/* Responsibilities completion status bar */}
              <div>
                <div className="flex justify-between text-xs text-[#77818A] dark:text-[#A2AFB5] mb-1">
                  <span>Responsibilities Progress</span>
                  <span className="font-semibold text-[#263238] dark:text-[#E7ECEB]">
                    {activeOutgoing.tasksCompleted} of {activeOutgoing.tasksTotal} completed
                  </span>
                </div>
                <div className="w-full bg-[#E5E8E5] dark:bg-[#354651] rounded-full h-2">
                  <div
                    className="bg-[#426B72] dark:bg-[#8DAEAA] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(activeOutgoing.tasksCompleted / activeOutgoing.tasksTotal) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                You currently have no active outgoing handover transitions.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={FilePlus2}
                onClick={() => navigate('/handovers/create')}
              >
                Initiate New Handover
              </Button>
            </div>
          )}
        </Card>

        {/* Quick CTA or Incoming Action Card */}
        <Card title="Quick Actions" subtitle="Employee tools">
          <div className="space-y-3">
            <button
              onClick={() => navigate('/handovers/create')}
              className="w-full flex items-center justify-between p-3.5 rounded-lg bg-gradient-to-r from-[#25364A] to-[#426B72] text-white hover:opacity-95 transition-opacity text-left shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <FilePlus2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    Create Handover Request
                  </h4>
                  <p className="text-[11px] text-white/80">
                    Resignation, transfer, or leave
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>

            <button
              onClick={() => navigate('/my-responsibilities')}
              className="w-full flex items-center justify-between p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] hover:bg-slate-50 dark:hover:bg-[#1D2C37] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#263238] dark:text-[#E7ECEB]">
                    Incoming Handover Inbox
                  </h4>
                  <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5]">
                    Accept or request clarification
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#77818A]" />
            </button>
          </div>
        </Card>
      </div>

      {/* Incoming Responsibilities Table */}
      <Card
        title="Responsibilities Transferred to You"
        subtitle="Tasks and deliverables requiring your sign-off or completion"
        action={
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-responsibilities')}>
            View All Incoming <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        }
        noPadding
      >
        <div className="divide-y divide-[#E5E8E5] dark:divide-[#354651]">
          {incomingTasks.map((t) => (
            <div
              key={t.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#1D2C37]/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {t.priority} PRIORITY
                  </span>
                  <span className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                    Transferred by <strong className="text-[#263238] dark:text-[#E7ECEB]">{t.from}</strong>
                  </span>
                </div>
                <h5 className="text-sm font-semibold text-[#263238] dark:text-[#E7ECEB]">
                  {t.title}
                </h5>
                <div className="flex items-center gap-2 text-xs text-[#77818A] dark:text-[#A2AFB5]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target Date: {formatDate(t.dueDate)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/my-responsibilities')}
                >
                  Manage Item
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
