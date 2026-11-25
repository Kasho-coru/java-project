import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import departmentService from '../services/departmentService';
import employeeService from '../services/employeeService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  ShieldCheck,
  Search,
  UserCheck
} from 'lucide-react';

const DEMO_DEPARTMENTS = [
  {
    id: 1,
    departmentName: 'Engineering',
    description: 'Software development, cloud infrastructure, quality assurance and architecture.',
    managerEmployeeId: 101,
    managerName: 'Marcus Brody',
    employeeCount: 9,
    activeHandoversCount: 3
  },
  {
    id: 2,
    departmentName: 'Product',
    description: 'Product lifecycle management, user research, UI/UX design, and feature strategy.',
    managerEmployeeId: 104,
    managerName: 'Elena Rostova',
    employeeCount: 5,
    activeHandoversCount: 2
  },
  {
    id: 3,
    departmentName: 'Operations',
    description: 'Enterprise IT systems, compliance, office administration and facilities.',
    managerEmployeeId: null,
    managerName: 'Unassigned',
    employeeCount: 4,
    activeHandoversCount: 1
  },
  {
    id: 4,
    departmentName: 'Finance',
    description: 'Corporate accounts, payroll processing, budget planning and fiscal audits.',
    managerEmployeeId: null,
    managerName: 'Unassigned',
    employeeCount: 3,
    activeHandoversCount: 1
  }
];

export const DepartmentManagementPage = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  const [departments, setDepartments] = useState(DEMO_DEPARTMENTS);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [formData, setFormData] = useState({
    departmentName: '',
    description: '',
    managerEmployeeId: ''
  });

  const loadData = async () => {
    try {
      const deptRes = await departmentService.getAll();
      if (deptRes?.data && deptRes.data.length > 0) {
        setDepartments(deptRes.data);
      }
      const empRes = await employeeService.getAll();
      if (empRes?.data) setEmployees(empRes.data);
    } catch {
      // Demo fallback
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = departments.filter((d) =>
    d.departmentName.toLowerCase().includes(search.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setSelectedDept(dept);
      setFormData({
        departmentName: dept.departmentName,
        description: dept.description || '',
        managerEmployeeId: dept.managerEmployeeId || ''
      });
    } else {
      setSelectedDept(null);
      setFormData({
        departmentName: '',
        description: '',
        managerEmployeeId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        departmentName: formData.departmentName,
        description: formData.description,
        managerEmployeeId: formData.managerEmployeeId ? Number(formData.managerEmployeeId) : null
      };

      if (selectedDept) {
        await departmentService.update(selectedDept.id, payload);
        setDepartments((prev) =>
          prev.map((item) =>
            item.id === selectedDept.id
              ? {
                  ...item,
                  ...payload,
                  managerName:
                    employees.find((e) => e.id === Number(payload.managerEmployeeId))
                      ? `${employees.find((e) => e.id === Number(payload.managerEmployeeId)).firstName} ${employees.find((e) => e.id === Number(payload.managerEmployeeId)).lastName}`
                      : 'Unassigned'
                }
              : item
          )
        );
      } else {
        try {
          const res = await departmentService.create(payload);
          if (res?.data) {
            setDepartments((prev) => [res.data, ...prev]);
          }
        } catch {
          const newDept = {
            id: Date.now(),
            ...payload,
            employeeCount: 0,
            activeHandoversCount: 0,
            managerName: 'Unassigned'
          };
          setDepartments((prev) => [newDept, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving department: ' + (err.message || 'Operation failed'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentService.delete(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#263238] dark:text-[#E7ECEB]">
            Department Directory
          </h2>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Configure operational divisions and assign department managers for transition approvals
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => handleOpenModal()}
          >
            Add Department
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <Card noPadding className="p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#77818A]" />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
          />
        </div>
      </Card>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dept) => (
          <Card key={dept.id} className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-[#426B72]/15 text-[#426B72] dark:text-[#8DAEAA]">
                  <Building2 className="w-5 h-5" />
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(dept)}
                      className="p-1 rounded text-[#77818A] hover:text-[#263238] dark:hover:text-[#E7ECEB]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="p-1 rounded text-[#77818A] hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-[#263238] dark:text-[#E7ECEB]">
                  {dept.departmentName}
                </h3>
                <p className="text-xs text-[#77818A] dark:text-[#A2AFB5] mt-1 line-clamp-2">
                  {dept.description || 'No detailed description provided.'}
                </p>
              </div>

              {/* Department Manager Tag (User Correction 1) */}
              <div className="pt-2 border-t border-[#E5E8E5] dark:border-[#354651]">
                <span className="text-[10px] uppercase font-semibold text-[#77818A] block mb-1">
                  Assigned Manager
                </span>
                <div className="flex items-center gap-2 text-xs font-medium text-[#25364A] dark:text-[#8DAEAA]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{dept.managerName || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            {/* Counts Footer */}
            <div className="mt-5 pt-3 border-t border-[#E5E8E5] dark:border-[#354651] flex items-center justify-between text-xs text-[#77818A] dark:text-[#A2AFB5]">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {dept.employeeCount || 0} Staff
              </span>
              <span>
                {dept.activeHandoversCount || 0} active handovers
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDept ? 'Edit Department' : 'Create New Department'}
        subtitle="Specify division name and assign department lead"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={formData.departmentName}
              onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
              placeholder="e.g. Information Security"
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
              Assigned Department Manager (for Approval Routing)
            </label>
            <select
              value={formData.managerEmployeeId}
              onChange={(e) => setFormData({ ...formData, managerEmployeeId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            >
              <option value="">Select Department Manager...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.designation})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5] mt-1">
              This manager will review and approve handover requests submitted within this department.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Primary responsibilities and scope of this division..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E8E5] dark:border-[#354651]">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentManagementPage;
