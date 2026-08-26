const FILTER_FORM_INITIAL_VALUES = {
  assignees: [],
  labels: [],
  dueStatus: "",
};

const DUE_STATUS_FILTER_OPTIONS = [
  { labelKey: "boardView.filters.dueStatus.overdue", value: "overdue" },
  { labelKey: "boardView.filters.dueStatus.dueSoon", value: "due_soon" },
  {
    labelKey: "boardView.filters.dueStatus.noDueDate",
    value: "no_due_date",
  },
];

export { DUE_STATUS_FILTER_OPTIONS, FILTER_FORM_INITIAL_VALUES };
