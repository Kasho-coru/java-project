export const HANDOVER_STATUS_CONFIG = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400'
  },
  PENDING_MANAGER: {
    label: 'Pending Manager',
    bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500'
  },
  PENDING_RECEIVER: {
    label: 'Pending Receiver',
    bg: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    dot: 'bg-sky-500'
  },
  CLARIFICATION_REQUESTED: {
    label: 'Clarification Needed',
    bg: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    dot: 'bg-orange-500'
  },
  REJECTED_BY_MANAGER: {
    label: 'Rejected by Manager',
    bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500'
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500'
  }
};

export const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
  },
  HIGH: {
    label: 'High',
    bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
  }
};

export const TASK_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800'
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
  }
};

export const HANDOVER_REASONS = [
  { value: 'RESIGNATION', label: 'Resignation' },
  { value: 'DEPARTMENT_TRANSFER', label: 'Department Transfer' },
  { value: 'EXTENDED_LEAVE', label: 'Extended Leave' },
  { value: 'ROLE_CHANGE', label: 'Role Change' },
  { value: 'OTHER', label: 'Other' }
];

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};
