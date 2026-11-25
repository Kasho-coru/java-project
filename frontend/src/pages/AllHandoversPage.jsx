import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import handoverService from '../services/handoverService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { HANDOVER_STATUS_CONFIG, formatDate } from '../utils/statusConfig';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  Send,
  Building,
  User
} from 'lucide-react';

const DEMO_HANDOVERS = [
  {
    id: 1,
    handoverCode: 'HO-2026-001',
    fromEmployeeName: 'Sarah Jenkins',
    fromEmployeeId: 102,
    toEmployeeName: 'David Kim',
    toEmployeeId: 103,
    departmentName: 'Engineering',
    reason: 'RESIGNATION',
    status: 'PENDING_MANAGER',
    taskCount: 4,
    lastWorkingDate: '2026-11-15',
    createdAt: '2026-10-28'
  },
  {
    id: 2,
    handoverCode: 'HO-2026-002',
    fromEmployeeName: 'Michael Chang',
    fromEmployeeId: 105,
    toEmployeeName: 'Elena Rostova',
    toEmployeeId: 104,
    departmentName: 'Product',
    reason: 'DEPARTMENT_TRANSFER',
    status: 'PENDING_RECEIVER',
    taskCount: 3,
    lastWorkingDate: '2026-11-08',
    createdAt: '2026-10-25'
  },
  {
    id: 3,
    handoverCode: 'HO-2026-003',
    fromEmployeeName: 'Amara Okafor',
    fromEmployeeId: 106,
    toEmployeeName: 'Liam Vance',
    toEmployeeId: 107,
    departmentName: 'Operations',
    reason: 'EXTENDED_LEAVE',
    status: 'COMPLETED',
    taskCount: 5,
    lastWorkingDate: '2026-10-25',
    createdAt: '2026-10-10'
  },
  {
    id: 4,
    handoverCode: 'HO-2026-004',
    fromEmployeeName: 'Priya Sharma',
    fromEmployeeId: 108,
    toEmployeeName: 'Alex Rivera',
    toEmployeeId: 109,
    departmentName: 'Engineering',
    reason: 'ROLE_CHANGE',
    status: 'DRAFT',
    taskCount: 2,
    lastWorkingDate: '2026-11-30',
    createdAt: '2026-10-30'
  }
];

export const AllHandoversPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [handovers, setHandovers] = useState(DEMO_HANDOVERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  useEffect(() => {
    const fetchHandovers = async () => {
      try {
        let res;
        if (currentUser?.role === 'EMPLOYEE') {
          res = await handoverService.getByEmployeeId(currentUser.employeeId);
        } else {
          res = await handoverService.getAll();
        }
        if (res?.data && res.data.length > 0) {
          setHandovers(res.data);
        }
      } catch {
        // Fallback demo data
      }
    };
    fetchHandovers();
  }, [currentUser]);

  const filtered = handovers.filter((ho) => {
    const matchesSearch =
      ho.handoverCode.toLowerCase().includes(search.toLowerCase()) ||
      ho.fromEmployeeName.toLowerCase().includes(search.toLowerCase()) ||
      ho.toEmployeeName.toLowerCase().includes(search.toLowerCase()) ||
      ho.departmentName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || ho.status === statusFilter;
    const matchesDept = deptFilter === 'ALL' || ho.departmentName === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#263238] dark:text-[#E7ECEB]">
            Handover Transitions Registry
          </h2>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Monitor transition progress, task counts, and approval stages across departments
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/handovers/create')}
        >
          Create Handover
        </Button>
      </div>

      {/* Filters Bar */}
      <Card noPadding className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#77818A]" />
            <input
              type="text"
              placeholder="Search by code, outgoing person, receiver or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_MANAGER">Pending Manager</option>
              <option value="PENDING_RECEIVER">Pending Receiver</option>
              <option value="CLARIFICATION_REQUESTED">Clarification Needed</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Handover List Table */}
      <Card noPadding>
        {filtered.length === 0 ? (
          <EmptyState
            title="No handover records match your criteria"
            description="Adjust your search query or reset status filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E8E5] dark:border-[#354651] text-[11px] uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5] bg-[#F5F6F4]/60 dark:bg-[#1D2C37]/40">
                  <th className="py-3 px-4 font-semibold">Code</th>
                  <th className="py-3 px-4 font-semibold">Outgoing Colleague</th>
                  <th className="py-3 px-4 font-semibold">Receiving Successor</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Reason</th>
                  <th className="py-3 px-4 font-semibold">Tasks</th>
                  <th className="py-3 px-4 font-semibold">Last Working Day</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8E5] dark:divide-[#354651] text-xs">
                {filtered.map((ho) => {
                  const statusConf = HANDOVER_STATUS_CONFIG[ho.status] || HANDOVER_STATUS_CONFIG.DRAFT;
                  return (
                    <tr
                      key={ho.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#1D2C37]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#25364A] dark:text-[#8DAEAA]">
                        {ho.handoverCode}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#263238] dark:text-[#E7ECEB]">
                        {ho.fromEmployeeName}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#263238] dark:text-[#E7ECEB]">
                        {ho.toEmployeeName}
                      </td>

                      <td className="py-3.5 px-4 text-[#77818A] dark:text-[#A2AFB5]">
                        {ho.departmentName}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#77818A] dark:text-[#A2AFB5]">
                          {ho.reason.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#25364A] dark:text-[#8DAEAA]">
                        {ho.taskCount} items
                      </td>

                      <td className="py-3.5 px-4 text-[#77818A] dark:text-[#A2AFB5]">
                        {formatDate(ho.lastWorkingDate)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusConf.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                          {statusConf.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => navigate(`/handovers/${ho.id}`)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AllHandoversPage;
