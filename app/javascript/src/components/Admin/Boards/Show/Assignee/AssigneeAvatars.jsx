import React from "react";

import { formatMemberName, getInitials } from "utils/members";

const AssigneeAvatars = ({ assignees, maxVisible = 3 }) => {
  const visibleAssignees = assignees.slice(0, maxVisible);
  const hiddenCount = assignees.length - visibleAssignees.length;

  return (
    <div className="flex items-center -space-x-1.5">
      {visibleAssignees.map(assignee => (
        <span
          aria-label={formatMemberName(assignee)}
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-medium text-indigo-700"
          key={assignee.id}
          title={formatMemberName(assignee)}
        >
          {getInitials(assignee)}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-600">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};

export default AssigneeAvatars;
