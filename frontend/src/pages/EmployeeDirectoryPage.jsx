import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/statusConfig';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Briefcase,
  Building,
  KeyRound,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Demonstration fallback employees
const DEMO_EMPLOYEES = [
  {
    id: 101,
    employeeCode: 'EMP-001',
    firstName: 'Marcus',
    lastName: 'Brody',
    email: 'm.brody@organization.com',
    phone: '+1 (555) 234-5678',
    designation: 'Engineering Director',
    departmentId: 1,
    departmentName: 'Engineering',
    joiningDate: '2021-03-15',
    employmentStatus: 'ACTIVE',
    username: 'manager',
    role: 'MANAGER'
  },
  {
    id: 102,
    employeeCode: 'EMP-002',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 's.jenkins@organization.com',
    phone: '+1 (555) 876-5432',
    designation: 'Senior Lead Engineer',
    departmentId: 1,
    departmentName: 'Engineering',
    joiningDate: '2022-06-01',
    employmentStatus: 'ON_NOTICE',
    username: 'sarah',
    role: 'EMPLOYEE'
  },
  {
    id: 103,
    employeeCode: 'EMP-003',
    firstName: 'David',
    lastName: 'Kim',
    email: 'd.kim@organization.com',
    phone: '+1 (555) 345-6789',
    designation: 'Software Engineer',
    departmentId: 1,
    departmentName: 'Engineering',
    joiningDate: '2023-09-15',
    employmentStatus: 'ACTIVE',
    username: 'david',
    role: 'EMPLOYEE'
  },
  {
    id: 104,
    employeeCode: 'EMP-004',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'e.rostova@organization.com',
    phone: '+1 (555) 456-7890',
    designation: 'Product Operations Manager',
    departmentId: 2,
    departmentName: 'Product',
    joiningDate: '2022-11-10',
    employmentStatus: 'ACTIVE',
    username: 'elena',
    role: 'EMPLOYEE'
  }
];

export const EmployeeDirectoryPage = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  const [employees, setEmployees] = useState(DEMO_EMPLOYEES);
  const [departments, setDepartments] = useState([
    { id: 1, departmentName: 'Engineering' },
    { id: 2, departmentName: 'Product' },
    { id: 3, departmentName: 'Operations' }
  ]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    departmentId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentStatus: 'ACTIVE',
    createLoginAccount: true,
    username: '',
    password: '',
    role: 'EMPLOYEE'
  });

  const loadData = async () => {
    try {
      const empRes = await employeeService.getAll();
      if (empRes?.data) setEmployees(empRes.data);
      const deptRes = await departmentService.getAll();
      if (deptRes?.data) setDepartments(deptRes.data);
    } catch (err) {
      // Keep demo data fallback
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept ? String(emp.departmentId) === String(selectedDept) : true;
    const matchesStatus = selectedStatus ? emp.employmentStatus === selectedStatus : true;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenAddModal = (emp = null) => {
    if (emp) {
      setSelectedEmployee(emp);
      setFormData({
        employeeCode: emp.employeeCode,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone || '',
        designation: emp.designation,
        departmentId: emp.departmentId,
        joiningDate: emp.joiningDate,
        employmentStatus: emp.employmentStatus,
        createLoginAccount: false,
        username: emp.username || '',
        password: '',
        role: emp.role || 'EMPLOYEE'
      });
    } else {
      setSelectedEmployee(null);
      const codeNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        employeeCode: `EMP-${codeNum}`,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        designation: '',
        departmentId: departments[0]?.id || 1,
        joiningDate: new Date().toISOString().split('T')[0],
        employmentStatus: 'ACTIVE',
        createLoginAccount: true,
        username: '',
        password: '',
        role: 'EMPLOYEE'
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    try {
      if (selectedEmployee) {
        await employeeService.update(selectedEmployee.id, formData);
        setEmployees((prev) =>
          prev.map((item) =>
            item.id === selectedEmployee.id
              ? {
                  ...item,
                  ...formData,
                  departmentName: departments.find((d) => String(d.id) === String(formData.departmentId))?.departmentName || item.departmentName
                }
              : item
          )
        );
      } else {
        const payload = {
          ...formData,
          departmentId: Number(formData.departmentId)
        };
        try {
          const res = await employeeService.create(payload);
          if (res?.data) {
            setEmployees((prev) => [res.data, ...prev]);
          }
        } catch {
          // Local fallback simulation
          const newEmp = {
            id: Date.now(),
            ...payload,
            departmentName: departments.find((d) => String(d.id) === String(formData.departmentId))?.departmentName || 'General'
          };
          setEmployees((prev) => [newEmp, ...prev]);
        }
      }
      setIsAddModalOpen(false);
    } catch (err) {
      alert('Error saving employee: ' + (err.message || 'Operation failed'));
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      await employeeService.delete(employeeToDelete.id);
      setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#263238] dark:text-[#E7ECEB]">
            Organizational Staff Directory
          </h2>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Manage personnel, assign departments, and configure system access accounts
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => handleOpenAddModal()}
          >
            Add New Employee
          </Button>
        )}
      </div>

      {/* Filters & Search */}
      <Card noPadding className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#77818A]" />
            <input
              type="text"
              placeholder="Search by name, email, employee code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_NOTICE">On Notice</option>
              <option value="TRANSFERRED">Transferred</option>
              <option value="RESIGNED">Resigned</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Employee Table */}
      <Card noPadding>
        {filteredEmployees.length === 0 ? (
          <EmptyState
            title="No matching staff records"
            description="Try modifying search keywords or clearing filter parameters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E8E5] dark:border-[#354651] text-[11px] uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5] bg-[#F5F6F4]/60 dark:bg-[#1D2C37]/40">
                  <th className="py-3 px-4 font-semibold">Staff Member</th>
                  <th className="py-3 px-4 font-semibold">Code</th>
                  <th className="py-3 px-4 font-semibold">Department & Role</th>
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold">Joining Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8E5] dark:divide-[#354651] text-xs">
                {filteredEmployees.map((emp) => {
                  const initials = `${emp.firstName?.charAt(0) || ''}${emp.lastName?.charAt(0) || ''}`;
                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#1D2C37]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#426B72]/20 text-[#426B72] dark:text-[#8DAEAA] flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-[#263238] dark:text-[#E7ECEB] block">
                              {emp.firstName} {emp.lastName}
                            </span>
                            <span className="text-[11px] text-[#77818A] dark:text-[#A2AFB5]">
                              {emp.designation}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-[#25364A] dark:text-[#8DAEAA]">
                        {emp.employeeCode}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="block font-medium text-[#263238] dark:text-[#E7ECEB]">
                          {emp.departmentName || 'Engineering'}
                        </span>
                        {emp.role && (
                          <span className="text-[10px] uppercase font-semibold text-[#77818A]">
                            Access: {emp.role}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[#77818A] dark:text-[#A2AFB5]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            <span>{emp.email}</span>
                          </div>
                          {emp.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3" />
                              <span>{emp.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#77818A] dark:text-[#A2AFB5]">
                        {formatDate(emp.joiningDate)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            emp.employmentStatus === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : emp.employmentStatus === 'ON_NOTICE'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {emp.employmentStatus.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#1D2C37] text-[#77818A] hover:text-[#263238] dark:hover:text-[#E7ECEB]"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleOpenAddModal(emp)}
                                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#1D2C37] text-[#77818A] hover:text-indigo-600 dark:hover:text-indigo-400"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEmployeeToDelete(emp);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#77818A] hover:text-rose-600 dark:hover:text-rose-400"
                                title="Deactivate"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Employee Modal with Login Account Creation */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={selectedEmployee ? 'Edit Staff Member' : 'Register New Employee'}
        subtitle="Configure profile and optional role-based system login account"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveEmployee} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                Employee Code *
              </label>
              <input
                type="text"
                required
                value={formData.employeeCode}
                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                Employment Status *
              </label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_NOTICE">On Notice</option>
                <option value="TRANSFERRED">Transferred</option>
                <option value="RESIGNED">Resigned</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                Department *
              </label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                Designation *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
              />
            </div>
          </div>

          {/* Section: Linked User Account Creation (User Correction 2) */}
          {!selectedEmployee && (
            <div className="p-4 rounded-xl border border-[#426B72]/30 bg-[#D7E2DF]/20 dark:bg-[#426B72]/15 space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#426B72] dark:text-[#8DAEAA]" />
                <h4 className="text-xs font-bold text-[#25364A] dark:text-[#E7ECEB]">
                  System Access Account (Spring Boot / MySQL `users` table)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. jsmith"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    placeholder="e.g. jsmith123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
                    Assigned Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
                  >
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E8E5] dark:border-[#354651]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {selectedEmployee ? 'Save Changes' : 'Create Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Staff Deactivation"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Are you sure you want to remove <strong>{employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong> ({employeeToDelete?.employeeCode})?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteEmployee}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Staff Profile Details"
      >
        {selectedEmployee && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E5E8E5] dark:border-[#354651]">
              <div className="w-12 h-12 rounded-full bg-[#426B72] text-white flex items-center justify-center font-bold text-sm">
                {selectedEmployee.firstName?.charAt(0)}{selectedEmployee.lastName?.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#263238] dark:text-[#E7ECEB]">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h4>
                <p className="text-[#77818A] dark:text-[#A2AFB5]">
                  {selectedEmployee.designation} • {selectedEmployee.departmentName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#77818A] block">Employee Code:</span>
                <span className="font-mono font-medium">{selectedEmployee.employeeCode}</span>
              </div>
              <div>
                <span className="text-[#77818A] block">Employment Status:</span>
                <span className="font-medium">{selectedEmployee.employmentStatus}</span>
              </div>
              <div>
                <span className="text-[#77818A] block">Email:</span>
                <span className="font-medium">{selectedEmployee.email}</span>
              </div>
              <div>
                <span className="text-[#77818A] block">Phone:</span>
                <span className="font-medium">{selectedEmployee.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#77818A] block">Joining Date:</span>
                <span className="font-medium">{formatDate(selectedEmployee.joiningDate)}</span>
              </div>
              <div>
                <span className="text-[#77818A] block">System Role:</span>
                <span className="font-medium">{selectedEmployee.role || 'EMPLOYEE'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeDirectoryPage;
