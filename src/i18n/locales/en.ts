export const en = {
  // Tab navigation
  tabs: {
    timer: 'Timer',
    projects: 'Projects',
    add: 'Add',
    history: 'History',
  },

  // Timer screen and controls
  timer: {
    status: {
      tracking: 'Tracking',
      paused: 'Paused',
      ready: 'Ready',
    },
    selectProject: 'Select a project to begin',
    quickStart: 'QUICK START',
    noProjects: 'No projects yet. Create one to get started.',
    savedToast: 'Saved {{duration}} to {{project}}',
    controls: {
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      discard: 'Discard',
    },
  },

  // Projects screen
  projects: {
    title: 'Projects',
    noProjects: 'No projects yet',
    createFirst: 'Tap + to create your first project',
    notFound: 'Project not found',
  },

  // Project form
  projectForm: {
    newProject: 'New Project',
    editProject: 'Edit Project',
    projectName: 'PROJECT NAME',
    namePlaceholder: 'e.g. Website Redesign',
    color: 'COLOR',
    createProject: 'Create Project',
    saveChanges: 'Save Changes',
    deleteProject: 'Delete Project',
    deleteConfirmWithEntries: 'This project has time entries. Deleting will remove all associated data.',
    deleteConfirmNoEntries: 'Are you sure you want to delete this project?',
  },

  // History screen
  history: {
    title: 'Time History',
    clearFilters: 'Clear filters',
    totalHours: 'Total hours',
    noEntriesFiltered: 'No entries match your filters',
    noEntries: 'No time entries yet',
    session_one: '{{count}} session',
    session_other: '{{count}} sessions',
  },

  // Add entry screen
  addEntry: {
    title: 'Add Time',
    addEntry: 'Add Entry',
    saving: 'Saving...',
    savedToast: 'Added {{duration}} to {{project}}',
    failedToSave: 'Failed to save entry',
  },

  // Edit entry screen
  editEntry: {
    title: 'Edit Entry',
    entryNotFound: 'Entry not found',
    timerWarning: 'A timer is currently running. Stop the timer before editing entries.',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    deleteEntry: 'Delete Entry',
    deleteConfirm: 'Delete this time entry?',
    saveFailed: 'Failed to save changes. Please try again.',
    deleteFailed: 'Failed to delete entry. Please try again.',
  },

  // Form labels and inputs
  form: {
    project: 'PROJECT',
    date: 'DATE',
    duration: 'DURATION',
    note: 'NOTE',
    optional: '(optional)',
    notePlaceholder: 'What did you work on?',
  },

  // Date labels
  date: {
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: '{{count}} days ago',
    weekAgo: '1 week ago',
    selectDate: 'Select Date',
  },

  // Date range filter options
  dateRange: {
    allTime: 'All Time',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    last7Days: 'Last 7 Days',
    thisMonth: 'This Month',
    last30Days: 'Last 30 Days',
    selectDateRange: 'Select Date Range',
    clearFilter: 'Clear Filter',
  },

  // Duration units
  duration: {
    hrs: 'hrs',
    min: 'min',
  },

  // Common strings
  common: {
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    error: 'Error',
    noProjects: 'No projects. Create one first.',
  },

  // 404 screen
  notFound: {
    title: 'Oops!',
    message: 'This screen does not exist.',
    goHome: 'Go to home screen!',
  },
} as const;
