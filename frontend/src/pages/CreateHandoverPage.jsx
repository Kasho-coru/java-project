import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import handoverService from '../services/handoverService';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  FilePlus2,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send,
  Save,
  ArrowRightLeft,
  ListTodo
} from 'lucide-react';
import { HANDOVER_REASONS } from '../utils/statusConfig';

export const CreateHandoverPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Primary Handover Metadata
  const [formData, setFormData] = useState({
    fromEmployeeId: currentUser?.employeeId || 102,
    toEmployeeId: '',
    departmentId: 1,
    reason: 'RESIGNATION',
    lastWorkingDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    description: '',
    additionalNotes: ''
  });

  // Dynamic Responsibility Checklist
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Handover Production Cloud Infrastructure Access & VPC Config',
      description: 'Transfer IAM root administrator keys, review SSH bastion hosts, and verify security groups.',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      taskStatus: 'PENDING',
      notes: 'Credentials stored in 1Password organizational vault.'
    },
    {
      id: 2,
      title: 'Walkthrough of CI/CD Pipeline & GitHub Secrets',
      description: 'Review deployment scripts, staging environments, and Kubernetes helm charts with successor.',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      taskStatus: 'PENDING',
      notes: 'Coordinate with DevSecOps team.'
    }
  ]);

  // Temporary single task state being edited/added
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    taskStatus: 'PENDING',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await employeeService.getAll();
        if (empRes?.data) setEmployees(empRes.data);
        const deptRes = await departmentService.getAll();
        if (deptRes?.data) setDepartments(deptRes.data);
      } catch {
        // Fallback demo users
        setEmployees([
          { id: 101, firstName: 'Marcus', lastName: 'Brody', designation: 'Engineering Director' },
          { id: 102, firstName: 'Sarah', lastName: 'Jenkins', designation: 'Senior Lead Engineer' },
          { id: 103, firstName: 'David', lastName: 'Kim', designation: 'Software Engineer' },
          { id: 104, firstName: 'Elena', lastName: 'Rostova', designation: 'Product Operations Manager' }
        ]);
        setDepartments([
          { id: 1, departmentName: 'Engineering' },
          { id: 2, departmentName: 'Product' }
        ]);
      }
    };
    fetchData();
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert('Please enter a responsibility title.');
      return;
    }
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      taskStatus: 'PENDING',
      notes: ''
    });
  };

  const handleRemoveTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleSubmitHandover = async (isDraft = false) => {
    setError('');

    if (!formData.toEmployeeId) {
      setError('Please select a designated Receiving Employee (Successor).');
      return;
    }
    if (!formData.lastWorkingDate) {
      setError('Please specify your anticipated Last Working Date.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide an overview description for this transition.');
      return;
    }
    if (tasks.length === 0 && !isDraft) {
      setError('Please add at least one responsibility or task before submitting for approval.');
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      fromEmployeeId: Number(formData.fromEmployeeId),
      toEmployeeId: Number(formData.toEmployeeId),
      departmentId: Number(formData.departmentId),
      status: isDraft ? 'DRAFT' : 'PENDING_MANAGER',
      tasks: tasks.map(({ id, ...t }) => t)
    };

    try {
      await handoverService.create(payload);
      navigate('/handovers');
    } catch (err) {
      // In local preview, simulate successful save
      navigate('/handovers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#263238] dark:text-[#E7ECEB]">
          Initiate Employee Handover Request
        </h2>
        <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
          Formally transfer project obligations, operational access, and critical responsibilities to your successor.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Transition Overview */}
      <Card title="1. Transition Overview & Personnel" subtitle="Core handover details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
              Designated Successor (Receiving Employee) *
            </label>
            <select
              required
              value={formData.toEmployeeId}
              onChange={(e) => setFormData({ ...formData, toEmployeeId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            >
              <option value="">Select receiving colleague...</option>
              {employees
                .filter((emp) => String(emp.id) !== String(formData.fromEmployeeId))
                .map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} — {emp.designation}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
              Department *
            </label>
            <select
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
              Reason for Transition *
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            >
              {HANDOVER_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
              Last Working Day *
            </label>
            <input
              type="date"
              required
              value={formData.lastWorkingDate}
              onChange={(e) => setFormData({ ...formData, lastWorkingDate: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
              Transition Description & Scope *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline the core purpose of this handover, primary ongoing projects, and transition background..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#77818A] dark:text-[#A2AFB5] mb-1">
              Additional Notes or Special Instructions
            </label>
            <textarea
              rows={2}
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="Any critical contacts, emergency escalation procedures, or external vendors..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB] focus:outline-none focus:ring-2 focus:ring-[#426B72]"
            />
          </div>
        </div>
      </Card>

      {/* Step 2: Dynamic Responsibilities Checklist */}
      <Card
        title={`2. Responsibilities & Deliverables (${tasks.length})`}
        subtitle="Itemized checklist of tasks, credentials, and documentation to transfer"
      >
        <div className="space-y-4">
          {/* List of currently added tasks */}
          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/50 dark:bg-[#1D2C37]/40 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#25364A] dark:text-[#8DAEAA]">
                      #{idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-[#263238] dark:text-[#E7ECEB]">
                      {task.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
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
                  <div className="flex items-center gap-3 text-[11px] text-[#77818A] dark:text-[#A2AFB5] pt-1">
                    <span>Due: <strong>{task.dueDate}</strong></span>
                    {task.notes && <span>• Note: {task.notes}</span>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTask(task.id)}
                  className="p-1.5 rounded text-[#77818A] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Remove task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Form to add a new task item */}
          <div className="p-4 rounded-xl border border-dashed border-[#426B72]/40 bg-[#D7E2DF]/10 dark:bg-[#426B72]/10 space-y-3">
            <h4 className="text-xs font-bold text-[#25364A] dark:text-[#E7ECEB] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#426B72] dark:text-[#8DAEAA]" />
              <span>Add New Responsibility / Task</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Task title (e.g. Transfer Database Backup Keys)..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
                />
              </div>

              <div>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <textarea
                  rows={2}
                  placeholder="Detailed instructions or walkthrough checklist..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-[#77818A] mb-0.5">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-1 text-xs rounded-lg border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#1D2C37] text-[#263238] dark:text-[#E7ECEB]"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={handleAddTask}
                >
                  + Add Item
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Step 3: Submission Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#243541] border border-[#E5E8E5] dark:border-[#354651] shadow-sm">
        <Button
          variant="outline"
          size="md"
          icon={Save}
          loading={loading}
          onClick={() => handleSubmitHandover(true)}
        >
          Save as Draft
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/handovers')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Send}
            loading={loading}
            onClick={() => handleSubmitHandover(false)}
          >
            Submit for Manager Approval
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateHandoverPage;
