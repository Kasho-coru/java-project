import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { HANDOVER_STATUS_CONFIG, formatDate } from '../../utils/statusConfig';

export const ManagerDashboard = ({ stats }) => {
  const navigate = useNavigate();

  const summary = stats?.summary || {
    departmentEmployees: 9,
    pendingApprovals: 2,
    approvedHandovers: 6,
    rejectedHandovers: 1,
  };

  const pendingRequests = stats?.pendingApprovalsList || [
    {
      id: 1,
      handoverCode: 'HO-2026-001',
      fromEmployeeName: 'Sarah Jenkins',
      designation: 'Senior Lead Engineer',
      toEmployeeName: 'David Kim',
      reason: 'RESIGNATION',
      taskCount: 4,
      lastWorkingDate: '2026-11-15',
      submittedDate: '2026-10-28'
    },
    {
      id: 4,
      handoverCode: 'HO-2026-004',
      fromEmployeeName: 'Priya Sharma',
      designation: 'QA Automation Lead',
      toEmployeeName: 'Alex Rivera',
      reason: 'EXTENDED_LEAVE',
      taskCount: 3,
      lastWorkingDate: '2026-11-20',
      submittedDate: '2026-10-30'
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Transfer AWS Root Production Credentials',
      assignedTo: 'David Kim',
      from: 'Sarah Jenkins',
      dueDate: '2026-11-05',
      priority: 'HIGH'
    },
    {
      id: 2,
      title: 'Customer Data Pipeline Walkthrough & SOP',
      assignedTo: 'David Kim',
      from: 'Sarah Jenkins',
      dueDate: '2026-11-09',
      priority: 'MEDIUM'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dept Team Members"
          value={summary.departmentEmployees}
          subtitle="Engineering unit"
          icon={Users}
          color="navy"
        />
        <StatCard
          title="Requires Approval"
          value={summary.pendingApprovals}
          subtitle="Awaiting your sign-off"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Approved Transitions"
          value={summary.approvedHandovers}
          subtitle="Transferred to receiver"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected / Clarified"
          value={summary.rejectedHandovers}
          subtitle="Sent back for updates"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Action Banner for Manager if Pending Approvals Exist */}
      {summary.pendingApprovals > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/30 dark:border-amber-700/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-950 dark:text-amber-200">
                {summary.pendingApprovals} Handover Request{summary.pendingApprovals > 1 ? 's' : ''} Need Your Review
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Review assigned responsibilities, critical credentials, and sign off to advance workflow.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/approvals')}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
          >
            Review Requests
          </Button>
        </div>
      )}

      {/* Grid: Pending Requests Table & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Handovers Requiring Your Sign-Off"
          subtitle="Submitted by exiting department personnel"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/approvals')}>
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
          className="lg:col-span-2"
          noPadding
        >
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-[#77818A] dark:text-[#A2AFB5] text-xs">
              All department handovers have been reviewed. No pending approvals!
            </div>
          ) : (
            <div className="divide-y divide-[#E5E8E5] dark:divide-[#354651]">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-[#1D2C37]/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#25364A] dark:text-[#8DAEAA]">
                        {req.handoverCode}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#77818A] dark:text-[#A2AFB5]">
                        {req.reason.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#263238] dark:text-[#E7ECEB]">
                      {req.fromEmployeeName} <span className="font-normal text-xs text-[#77818A]">({req.designation})</span>
                    </p>
                    <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                      Designated Successor: <span className="font-medium text-[#263238] dark:text-[#E7ECEB]">{req.toEmployeeName}</span> • {req.taskCount} responsibilities assigned
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[#77818A] dark:text-[#A2AFB5] pt-1">
                      <span>Submitted: {formatDate(req.submittedDate)}</span>
                      <span>•</span>
                      <span>Last Working Day: <strong className="text-rose-600 dark:text-rose-400">{formatDate(req.lastWorkingDate)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/handovers/${req.id}`)}
                    >
                      Inspect & Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Transfer Deadlines */}
        <Card title="Upcoming Transition Milestones" subtitle="High priority deliverables">
          <div className="space-y-3">
            {upcomingDeadlines.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/40 dark:bg-[#1D2C37]/40 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-xs font-semibold text-[#263238] dark:text-[#E7ECEB] line-clamp-2">
                    {task.title}
                  </h5>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    task.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#77818A] dark:text-[#A2AFB5]">
                  <span>Assignee: {task.assignedTo}</span>
                  <span className="font-medium flex items-center gap-1 text-[#25364A] dark:text-[#8DAEAA]">
                    <Calendar className="w-3 h-3" /> {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate('/handovers')}
            >
              View Full Schedule
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
