import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import handoverService from '../services/handoverService';
import taskService from '../services/taskService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/statusConfig';
import {
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Calendar,
  User,
  ListCheck
} from 'lucide-react';

const DEMO_INCOMING = [
  {
    id: 1,
    handoverCode: 'HO-2026-001',
    fromEmployeeName: 'Sarah Jenkins',
    fromEmployeeDesignation: 'Senior Lead Engineer',
    departmentName: 'Engineering',
    status: 'PENDING_RECEIVER',
    lastWorkingDate: '2026-11-15',
    tasks: [
      {
        id: 1,
        title: 'Transfer AWS Root Production Credentials & Bastion Access',
        description: 'Verify IAM permissions, revoke old keys, and provision new credentials for David.',
        priority: 'HIGH',
        dueDate: '2026-11-05',
        taskStatus: 'PENDING'
      },
      {
        id: 2,
        title: 'Conduct CI/CD Pipeline Architecture Walkthrough',
        description: 'Review GitHub Actions workflows, Docker image build pipelines, and staging deploy webhooks.',
        priority: 'MEDIUM',
        dueDate: '2026-11-08',
        taskStatus: 'IN_PROGRESS'
      },
      {
        id: 3,
        title: 'Customer Data Migration SOP Documentation',
        description: 'Write runbook for scheduled database schema migrations and rollbacks.',
        priority: 'LOW',
        dueDate: '2026-11-12',
        taskStatus: 'PENDING'
      }
    ]
  }
];

export const MyResponsibilitiesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [incomingList, setIncomingList] = useState(DEMO_INCOMING);
  const [selectedHandover, setSelectedHandover] = useState(null);
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [clarificationText, setClarificationText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAcceptHandover = async (id) => {
    setLoading(true);
    try {
      await handoverService.accept(id);
      setIncomingList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'COMPLETED' } : item))
      );
      alert('Handover accepted! Responsibilities have been formally transferred to you.');
    } catch {
      setIncomingList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'COMPLETED' } : item))
      );
      alert('Handover accepted!');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClarification = async () => {
    if (!clarificationText.trim()) {
      alert('Please specify what requires clarification.');
      return;
    }
    setLoading(true);
    try {
      await handoverService.requestClarification(selectedHandover.id, { comment: clarificationText });
      setIncomingList((prev) =>
        prev.map((item) =>
          item.id === selectedHandover.id ? { ...item, status: 'CLARIFICATION_REQUESTED' } : item
        )
      );
      setIsClarificationModalOpen(false);
      setClarificationText('');
      alert('Clarification request sent to the outgoing employee.');
    } catch {
      setIncomingList((prev) =>
        prev.map((item) =>
          item.id === selectedHandover.id ? { ...item, status: 'CLARIFICATION_REQUESTED' } : item
        )
      );
      setIsClarificationModalOpen(false);
      setClarificationText('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#263238] dark:text-[#E7ECEB]">
          My Incoming Responsibilities & Knowledge Transfer
        </h2>
        <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
          Review tasks and operational knowledge transferred to you by departing colleagues. Confirm acceptance or request additional walkthroughs.
        </p>
      </div>

      {incomingList.length === 0 ? (
        <Card>
          <EmptyState
            icon={CheckCircle2}
            title="No incoming transfers"
            description="You do not currently have any pending incoming handover assignments."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {incomingList.map((ho) => (
            <Card key={ho.id} noPadding className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E8E5] dark:border-[#354651]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#25364A] dark:text-[#8DAEAA]">
                      {ho.handoverCode}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      ho.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : ho.status === 'CLARIFICATION_REQUESTED'
                        ? 'bg-orange-50 text-orange-800 border-orange-200'
                        : 'bg-sky-50 text-sky-800 border-sky-200'
                    }`}>
                      {ho.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#263238] dark:text-[#E7ECEB] mt-1">
                    Transferred by: {ho.fromEmployeeName} ({ho.fromEmployeeDesignation})
                  </h3>
                  <p className="text-xs text-[#77818A]">
                    Department: {ho.departmentName} • Target Completion: {formatDate(ho.lastWorkingDate)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => navigate(`/handovers/${ho.id}`)}
                  >
                    View Details
                  </Button>
                  {ho.status === 'PENDING_RECEIVER' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={AlertCircle}
                        onClick={() => {
                          setSelectedHandover(ho);
                          setIsClarificationModalOpen(true);
                        }}
                      >
                        Clarify
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        icon={CheckCircle2}
                        loading={loading}
                        onClick={() => handleAcceptHandover(ho.id)}
                      >
                        Accept All
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Responsibilities list */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#77818A] uppercase tracking-wider">
                  Itemized Responsibilities ({ho.tasks.length})
                </h4>
                {ho.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/50 dark:bg-[#1D2C37]/40 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          task.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority}
                        </span>
                        <h5 className="text-xs font-bold text-[#263238] dark:text-[#E7ECEB]">
                          {task.title}
                        </h5>
                      </div>
                      <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-[#77818A]">
                        <Calendar className="w-3 h-3" />
                        <span>Deadline: {formatDate(task.dueDate)}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-[#426B72] dark:text-[#8DAEAA] shrink-0">
                      {task.taskStatus}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Clarification Modal */}
      <Modal
        isOpen={isClarificationModalOpen}
        onClose={() => setIsClarificationModalOpen(false)}
        title="Request Task Clarification"
        subtitle="Explain what details or credentials require further documentation"
      >
        <div className="space-y-4">
          <textarea
            rows={3}
            required
            placeholder="e.g. Please provide the repository access permissions and staging server SSH bastion details..."
            value={clarificationText}
            onChange={(e) => setClarificationText(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsClarificationModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={loading} onClick={handleRequestClarification}>
              Submit Clarification Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyResponsibilitiesPage;
