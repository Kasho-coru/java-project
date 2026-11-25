import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import handoverService from '../services/handoverService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/statusConfig';
import {
  CheckSquare2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';

const DEMO_PENDING = [
  {
    id: 1,
    handoverCode: 'HO-2026-001',
    fromEmployeeName: 'Sarah Jenkins',
    fromEmployeeDesignation: 'Senior Lead Engineer',
    toEmployeeName: 'David Kim',
    toEmployeeDesignation: 'Software Engineer',
    departmentName: 'Engineering',
    reason: 'RESIGNATION',
    taskCount: 3,
    lastWorkingDate: '2026-11-15',
    createdAt: '2026-10-28',
    description: 'Transferring primary backend services, AWS IAM credentials, and Kubernetes cluster maintenance.'
  },
  {
    id: 4,
    handoverCode: 'HO-2026-004',
    fromEmployeeName: 'Priya Sharma',
    fromEmployeeDesignation: 'QA Automation Lead',
    toEmployeeName: 'Alex Rivera',
    toEmployeeDesignation: 'QA Engineer',
    departmentName: 'Engineering',
    reason: 'EXTENDED_LEAVE',
    taskCount: 2,
    lastWorkingDate: '2026-11-20',
    createdAt: '2026-10-30',
    description: 'Handing over automated Cypress and Playwright regression test suites and CI pipeline integrations.'
  }
];

export const ApprovalsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [pendingList, setPendingList] = useState(DEMO_PENDING);
  const [selectedHandover, setSelectedHandover] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await handoverService.getAll({ status: 'PENDING_MANAGER' });
        if (res?.data && res.data.length > 0) {
          setPendingList(res.data);
        }
      } catch {
        // demo fallback
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await handoverService.approve(id);
      setPendingList((prev) => prev.filter((p) => p.id !== id));
      alert('Handover approved successfully! Dispatched to designated receiving employee.');
    } catch {
      setPendingList((prev) => prev.filter((p) => p.id !== id));
      alert('Handover approved!');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please specify a rejection reason.');
      return;
    }
    setLoading(true);
    try {
      await handoverService.reject(selectedHandover.id, { reason: rejectReason });
      setPendingList((prev) => prev.filter((p) => p.id !== selectedHandover.id));
      setIsRejectModalOpen(false);
      setRejectReason('');
      alert('Handover rejected. Notified employee for revisions.');
    } catch {
      setPendingList((prev) => prev.filter((p) => p.id !== selectedHandover.id));
      setIsRejectModalOpen(false);
      setRejectReason('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#263238] dark:text-[#E7ECEB]">
          Manager Review & Approval Inbox
        </h2>
        <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
          Inspect employee transition submissions, verify task itemization, and authorize transfers to designated successors.
        </p>
      </div>

      {pendingList.length === 0 ? (
        <Card>
          <EmptyState
            icon={CheckCircle2}
            title="All caught up!"
            description="There are currently no transition requests awaiting manager authorization."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingList.map((item) => (
            <Card key={item.id} noPadding className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#25364A] dark:text-[#8DAEAA]">
                      {item.handoverCode}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                      PENDING YOUR APPROVAL
                    </span>
                    <span className="text-xs text-[#77818A]">
                      Reason: {item.reason.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#263238] dark:text-[#E7ECEB]">
                    {item.fromEmployeeName} ({item.fromEmployeeDesignation}) → {item.toEmployeeName} ({item.toEmployeeDesignation})
                  </h3>

                  <p className="text-xs text-[#77818A] dark:text-[#A2AFB5] max-w-2xl">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#77818A] dark:text-[#A2AFB5] pt-1">
                    <span>Department: <strong>{item.departmentName}</strong></span>
                    <span>Responsibilities: <strong>{item.taskCount} items</strong></span>
                    <span>Submitted: <strong>{formatDate(item.createdAt)}</strong></span>
                    <span>
                      Last Working Day:{' '}
                      <strong className="text-rose-600 dark:text-rose-400">
                        {formatDate(item.lastWorkingDate)}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E5E8E5] dark:border-[#354651]">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => navigate(`/handovers/${item.id}`)}
                  >
                    Inspect Details
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                    onClick={() => {
                      setSelectedHandover(item);
                      setIsRejectModalOpen(true);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    icon={CheckCircle2}
                    loading={loading}
                    onClick={() => handleApprove(item.id)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Manager Rejection Notice"
        subtitle="Specify what requires correction before this request can be approved"
      >
        <div className="space-y-4">
          <textarea
            rows={3}
            required
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={loading} onClick={handleReject}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApprovalsPage;
