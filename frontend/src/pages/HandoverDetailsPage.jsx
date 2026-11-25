import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import handoverService from '../services/handoverService';
import taskService from '../services/taskService';
import commentService from '../services/commentService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { HANDOVER_STATUS_CONFIG, formatDate } from '../utils/statusConfig';
import {
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  MessageSquare,
  History,
  Send,
  User,
  ShieldCheck,
  CheckSquare,
  AlertCircle,
  Plus
} from 'lucide-react';

export const HandoverDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, hasRole } = useAuth();

  const [handover, setHandover] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals for actions
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [clarificationText, setClarificationText] = useState('');
  const [newComment, setNewComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fallback demo dataset for individual inspection
  const loadDemoData = () => {
    setHandover({
      id: Number(id) || 1,
      handoverCode: 'HO-2026-001',
      fromEmployeeId: 102,
      fromEmployeeName: 'Sarah Jenkins',
      fromEmployeeDesignation: 'Senior Lead Engineer',
      fromEmployeeEmail: 's.jenkins@organization.com',
      toEmployeeId: 103,
      toEmployeeName: 'David Kim',
      toEmployeeDesignation: 'Software Engineer',
      toEmployeeEmail: 'd.kim@organization.com',
      departmentId: 1,
      departmentName: 'Engineering',
      reason: 'RESIGNATION',
      description: 'Transferring primary software engineering responsibilities, production infrastructure administration, and ongoing sprint initiatives prior to my final day at the organization.',
      additionalNotes: 'Critical credentials stored in encrypted organizational vault. In case of emergency outage during transition, contact DevOps lead directly.',
      lastWorkingDate: '2026-11-15',
      status: 'PENDING_MANAGER',
      createdAt: '2026-10-28T10:30:00'
    });

    setTasks([
      {
        id: 1,
        title: 'Transfer AWS Root Production Credentials & Bastion Access',
        description: 'Verify IAM permissions, revoke old keys, and provision new credentials for David.',
        priority: 'HIGH',
        dueDate: '2026-11-05',
        taskStatus: 'PENDING',
        notes: 'Coordinate with Infosec officer.'
      },
      {
        id: 2,
        title: 'Conduct CI/CD Pipeline Architecture Walkthrough',
        description: 'Review GitHub Actions workflows, Docker image build pipelines, and staging deploy webhooks.',
        priority: 'MEDIUM',
        dueDate: '2026-11-08',
        taskStatus: 'IN_PROGRESS',
        notes: 'Recorded meeting link added to team Confluence.'
      },
      {
        id: 3,
        title: 'Customer Data Migration SOP Documentation',
        description: 'Write runbook for scheduled database schema migrations and rollbacks.',
        priority: 'LOW',
        dueDate: '2026-11-12',
        taskStatus: 'PENDING',
        notes: 'Draft in Notion.'
      }
    ]);

    setComments([
      {
        id: 1,
        userName: 'David Kim',
        userRole: 'EMPLOYEE',
        comment: 'I reviewed the initial checklist. Can we schedule the AWS IAM walkthrough for this Thursday?',
        createdAt: '2026-10-29T14:15:00'
      },
      {
        id: 2,
        userName: 'Sarah Jenkins',
        userRole: 'EMPLOYEE',
        comment: 'Thursday 2 PM works perfectly. I will send an invite with the runbook attached.',
        createdAt: '2026-10-29T15:00:00'
      }
    ]);

    setHistory([
      {
        id: 1,
        action: 'Handover Created',
        description: 'Handover request initiated by Sarah Jenkins with 3 responsibilities.',
        performedByName: 'Sarah Jenkins',
        createdAt: '2026-10-28T10:30:00'
      },
      {
        id: 2,
        action: 'Submitted for Approval',
        description: 'Handover submitted for Engineering Manager review.',
        performedByName: 'Sarah Jenkins',
        createdAt: '2026-10-28T10:35:00'
      }
    ]);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await handoverService.getById(id);
        if (res?.data) {
          setHandover(res.data);
          if (res.data.tasks) setTasks(res.data.tasks);
          if (res.data.comments) setComments(res.data.comments);
          if (res.data.history) setHistory(res.data.history);
        } else {
          loadDemoData();
        }
      } catch {
        loadDemoData();
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Workflow Action Handlers
  const handleManagerApprove = async () => {
    setActionLoading(true);
    try {
      await handoverService.approve(handover.id);
      setHandover({ ...handover, status: 'PENDING_RECEIVER' });
      addHistoryLog('Manager Approved', 'Manager Marcus Brody approved the handover. Moved to receiver review.');
    } catch {
      setHandover({ ...handover, status: 'PENDING_RECEIVER' });
      addHistoryLog('Manager Approved', 'Manager approved the transition.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManagerReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please enter a mandatory rejection reason.');
      return;
    }
    setActionLoading(true);
    try {
      await handoverService.reject(handover.id, { reason: rejectReason });
      setHandover({ ...handover, status: 'REJECTED_BY_MANAGER' });
      addHistoryLog('Manager Rejected', `Handover rejected: ${rejectReason}`);
      setIsRejectModalOpen(false);
    } catch {
      setHandover({ ...handover, status: 'REJECTED_BY_MANAGER' });
      addHistoryLog('Manager Rejected', `Handover rejected: ${rejectReason}`);
      setIsRejectModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReceiverAccept = async () => {
    setActionLoading(true);
    try {
      await handoverService.accept(handover.id);
      setHandover({ ...handover, status: 'COMPLETED' });
      addHistoryLog('Receiver Accepted', 'Receiving successor David Kim accepted all transferred responsibilities. Handover COMPLETED.');
    } catch {
      setHandover({ ...handover, status: 'COMPLETED' });
      addHistoryLog('Receiver Accepted', 'Handover successfully completed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReceiverClarification = async () => {
    if (!clarificationText.trim()) {
      alert('Please state what requires clarification.');
      return;
    }
    setActionLoading(true);
    try {
      await handoverService.requestClarification(handover.id, { comment: clarificationText });
      setHandover({ ...handover, status: 'CLARIFICATION_REQUESTED' });
      addHistoryLog('Clarification Requested', `Receiver requested clarification: ${clarificationText}`);
      setIsClarificationModalOpen(false);
    } catch {
      setHandover({ ...handover, status: 'CLARIFICATION_REQUESTED' });
      addHistoryLog('Clarification Requested', `Receiver requested clarification: ${clarificationText}`);
      setIsClarificationModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Correction 3: Outgoing Employee resubmits after clarification requested -> PENDING_MANAGER
  const handleResubmitAfterClarification = async () => {
    setActionLoading(true);
    try {
      await handoverService.submit(handover.id);
      setHandover({ ...handover, status: 'PENDING_MANAGER' });
      addHistoryLog('Handover Resubmitted', 'Outgoing employee addressed clarification points and resubmitted for manager review.');
    } catch {
      setHandover({ ...handover, status: 'PENDING_MANAGER' });
      addHistoryLog('Handover Resubmitted', 'Handover resubmitted for manager review.');
    } finally {
      setActionLoading(false);
    }
  };

  const addHistoryLog = (action, description) => {
    setHistory((prev) => [
      {
        id: Date.now(),
        action,
        description,
        performedByName: currentUser?.fullName || 'Current User',
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      userName: currentUser?.fullName || 'Sarah Jenkins',
      userRole: currentUser?.role || 'EMPLOYEE',
      comment: newComment,
      createdAt: new Date().toISOString()
    };

    try {
      await commentService.create(handover.id, { comment: newComment });
      setComments([...comments, commentObj]);
    } catch {
      setComments([...comments, commentObj]);
    }
    setNewComment('');
  };

  const handleToggleTaskStatus = async (task) => {
    const nextStatus =
      task.taskStatus === 'PENDING'
        ? 'IN_PROGRESS'
        : task.taskStatus === 'IN_PROGRESS'
        ? 'COMPLETED'
        : 'PENDING';

    try {
      await taskService.update(task.id, { ...task, taskStatus: nextStatus });
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, taskStatus: nextStatus } : t)));
    } catch {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, taskStatus: nextStatus } : t)));
    }
  };

  if (loading || !handover) {
    return <div className="text-center py-20 text-xs text-[#77818A]">Loading transition details...</div>;
  }

  const statusConf = HANDOVER_STATUS_CONFIG[handover.status] || HANDOVER_STATUS_CONFIG.DRAFT;
  const isManager = currentUser?.role === 'MANAGER' || currentUser?.role === 'ADMIN';
  const isReceiver = currentUser?.role === 'EMPLOYEE';
  const isOutgoing = currentUser?.role === 'EMPLOYEE';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner / Actions Card */}
      <Card noPadding className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-bold text-[#25364A] dark:text-[#8DAEAA]">
                {handover.handoverCode}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConf.bg}`}>
                <span className={`w-2 h-2 rounded-full ${statusConf.dot}`} />
                {statusConf.label}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#263238] dark:text-[#E7ECEB]">
              Handover: {handover.fromEmployeeName} → {handover.toEmployeeName}
            </h2>
            <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
              Department: <strong>{handover.departmentName}</strong> • Reason:{' '}
              <strong>{handover.reason.replace('_', ' ')}</strong>
            </p>
          </div>

          {/* Workflow Action Buttons (Role and Status Dependent) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Manager Actions during PENDING_MANAGER */}
            {isManager && handover.status === 'PENDING_MANAGER' && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  icon={XCircle}
                  loading={actionLoading}
                  onClick={() => setIsRejectModalOpen(true)}
                >
                  Reject with Reason
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  icon={CheckCircle2}
                  loading={actionLoading}
                  onClick={handleManagerApprove}
                >
                  Approve Handover
                </Button>
              </>
            )}

            {/* Receiver Actions during PENDING_RECEIVER */}
            {handover.status === 'PENDING_RECEIVER' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={AlertCircle}
                  loading={actionLoading}
                  onClick={() => setIsClarificationModalOpen(true)}
                >
                  Request Clarification
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  icon={CheckCircle2}
                  loading={actionLoading}
                  onClick={handleReceiverAccept}
                >
                  Confirm & Accept Handover
                </Button>
              </>
            )}

            {/* Outgoing Employee Resubmission after Clarification */}
            {handover.status === 'CLARIFICATION_REQUESTED' && (
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                loading={actionLoading}
                onClick={handleResubmitAfterClarification}
              >
                Update & Resubmit for Approval
              </Button>
            )}

            {/* Outgoing Employee Submit if in DRAFT */}
            {handover.status === 'DRAFT' && (
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                loading={actionLoading}
                onClick={handleResubmitAfterClarification}
              >
                Submit for Manager Approval
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Grid: Personnel & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Outgoing Colleague" subtitle="Initiator transferring work">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25364A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {handover.fromEmployeeName?.charAt(0)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#263238] dark:text-[#E7ECEB]">
                {handover.fromEmployeeName}
              </h4>
              <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                {handover.fromEmployeeDesignation}
              </p>
              <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                {handover.fromEmployeeEmail}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E8E5] dark:border-[#354651] text-xs flex justify-between">
            <span className="text-[#77818A] dark:text-[#A2AFB5]">Last Working Day:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {formatDate(handover.lastWorkingDate)}
            </span>
          </div>
        </Card>

        <Card title="Receiving Colleague (Successor)" subtitle="Assigned receiver">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#426B72] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {handover.toEmployeeName?.charAt(0)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#263238] dark:text-[#E7ECEB]">
                {handover.toEmployeeName}
              </h4>
              <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                {handover.toEmployeeDesignation}
              </p>
              <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                {handover.toEmployeeEmail}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E8E5] dark:border-[#354651] text-xs flex justify-between">
            <span className="text-[#77818A] dark:text-[#A2AFB5]">Department:</span>
            <span className="font-semibold text-[#25364A] dark:text-[#8DAEAA]">
              {handover.departmentName}
            </span>
          </div>
        </Card>
      </div>

      {/* Description & Notes */}
      <Card title="Scope & Instructions">
        <div className="space-y-3 text-xs">
          <div>
            <h5 className="font-semibold text-[#77818A] dark:text-[#A2AFB5] uppercase text-[10px] tracking-wider mb-1">
              General Overview
            </h5>
            <p className="text-[#263238] dark:text-[#E7ECEB] leading-relaxed bg-[#F5F6F4]/50 dark:bg-[#1D2C37]/30 p-3 rounded-lg border border-[#E5E8E5] dark:border-[#354651]">
              {handover.description}
            </p>
          </div>
          {handover.additionalNotes && (
            <div>
              <h5 className="font-semibold text-[#77818A] dark:text-[#A2AFB5] uppercase text-[10px] tracking-wider mb-1">
                Additional Notes & Critical Access
              </h5>
              <p className="text-[#263238] dark:text-[#E7ECEB] leading-relaxed bg-[#F5F6F4]/50 dark:bg-[#1D2C37]/30 p-3 rounded-lg border border-[#E5E8E5] dark:border-[#354651]">
                {handover.additionalNotes}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Responsibilities Checklist */}
      <Card
        title={`Assigned Responsibilities & Tasks (${tasks.length})`}
        subtitle="Click status badge to toggle task completion state"
      >
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className="p-4 rounded-xl border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/40 dark:bg-[#1D2C37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#25364A] dark:text-[#8DAEAA]">
                    #{idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-[#263238] dark:text-[#E7ECEB]">
                    {task.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      task.priority === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : task.priority === 'MEDIUM'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                  {task.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-[#77818A] dark:text-[#A2AFB5] pt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Due: {formatDate(task.dueDate)}
                  </span>
                  {task.notes && <span>• Note: {task.notes}</span>}
                </div>
              </div>

              {/* Interactive Status Switcher */}
              <button
                type="button"
                onClick={() => handleToggleTaskStatus(task)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left shrink-0 ${
                  task.taskStatus === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : task.taskStatus === 'IN_PROGRESS'
                    ? 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
                title="Click to toggle status"
              >
                ✓ {task.taskStatus.replace('_', ' ')}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Workflow History Timeline & Comments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Timeline */}
        <Card title="Workflow History Audit" subtitle="Chronological transition activity">
          <div className="space-y-4 relative pl-4 border-l-2 border-[#D7E2DF] dark:border-[#426B72]/40">
            {history.map((hist) => (
              <div key={hist.id} className="relative group">
                <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-[#426B72] ring-4 ring-white dark:ring-[#243541]" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#263238] dark:text-[#E7ECEB]">
                      {hist.action}
                    </span>
                    <span className="text-[10px] text-[#77818A] dark:text-[#A2AFB5]">
                      {formatDate(hist.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#77818A] dark:text-[#A2AFB5] mt-0.5">
                    {hist.description}
                  </p>
                  <p className="text-[10px] text-[#426B72] dark:text-[#8DAEAA] font-medium mt-0.5">
                    By: {hist.performedByName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Comments & Discussion */}
        <Card title="Transition Comments & Queries" subtitle="Clarifications and handover notes">
          <div className="space-y-4">
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-[#77818A] dark:text-[#A2AFB5] text-center py-4">
                  No comments yet. Start the conversation below.
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg bg-[#F5F6F4] dark:bg-[#1D2C37]/50 border border-[#E5E8E5] dark:border-[#354651] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#263238] dark:text-[#E7ECEB]">
                        {c.userName}
                      </span>
                      <span className="text-[10px] text-[#77818A]">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-[#77818A] dark:text-[#A2AFB5]">{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Post an update or question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              />
              <Button type="submit" variant="primary" size="sm" icon={Send}>
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Manager Rejection Reason"
        subtitle="Provide mandatory feedback so the employee can revise the handover"
      >
        <div className="space-y-4">
          <textarea
            rows={3}
            required
            placeholder="Specify reason for rejecting this transition request..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleManagerReject}>
              Submit Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clarification Modal */}
      <Modal
        isOpen={isClarificationModalOpen}
        onClose={() => setIsClarificationModalOpen(false)}
        title="Request Handover Clarification"
        subtitle="Identify missing credentials, unassigned repositories, or unclear instructions"
      >
        <div className="space-y-4">
          <textarea
            rows={3}
            required
            placeholder="Details on what additional knowledge or tasks must be clarified..."
            value={clarificationText}
            onChange={(e) => setClarificationText(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsClarificationModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleReceiverClarification}>
              Request Clarification
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HandoverDetailsPage;
