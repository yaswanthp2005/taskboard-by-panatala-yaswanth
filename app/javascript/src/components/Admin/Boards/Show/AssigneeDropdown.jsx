import React, { useMemo } from "react";

import { useFetchBoardMembers } from "components/hooks/reactQuery/useMembersApi";
import { Check, UserAdd } from "neetoicons";
import { Dropdown, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import AssigneeAvatars from "./AssigneeAvatars";
import { formatMemberName } from "./CardDetailPane/utils";

const AssigneeDropdown = ({
  boardSlug,
  label,
  onToggle,
  selectedIds,
  triggerClassName = "shrink-0 text-gray-400",
}) => {
  const { t } = useTranslation();
  const { data: members = [], isLoading } = useFetchBoardMembers(boardSlug);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedAssignees = useMemo(
    () => members.filter(member => selectedIdSet.has(member.id)),
    [members, selectedIdSet]
  );

  const handleClick = event => {
    event.stopPropagation();
  };

  const handleToggle = memberId => {
    onToggle(memberId);
  };

  if (isLoading) {
    return null;
  }

  return (
    <span
      className={triggerClassName}
      role="presentation"
      onClick={handleClick}
    >
      <Dropdown
        buttonProps={{ className: "shrink-0", iconSize: 16, style: "text" }}
        dropdownProps={{ appendTo: () => document.body }}
        icon={selectedAssignees.length ? undefined : UserAdd}
        position="bottom-end"
        strategy="fixed"
        label={
          selectedAssignees.length ? (
            <AssigneeAvatars assignees={selectedAssignees} />
          ) : (
            label || ""
          )
        }
      >
        <Dropdown.Menu>
          {members.map(member => {
            const isSelected = selectedIdSet.has(member.id);

            return (
              <Dropdown.MenuItem.Button
                key={member.id}
                onClick={() => handleToggle(member.id)}
              >
                <div className="flex w-full min-w-[180px] items-center justify-between gap-x-3">
                  <Typography style="body2">
                    {formatMemberName(member)}
                  </Typography>
                  {isSelected && (
                    <Check className="shrink-0 text-indigo-600" size={16} />
                  )}
                </div>
              </Dropdown.MenuItem.Button>
            );
          })}
          {!members.length && (
            <Dropdown.MenuItem isDisabled>
              {t("cardDetail.noAssigneesAvailable")}
            </Dropdown.MenuItem>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </span>
  );
};

AssigneeDropdown.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  label: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  triggerClassName: PropTypes.string,
};

AssigneeDropdown.defaultProps = {
  label: "",
  triggerClassName: "shrink-0 text-gray-400",
};

export default AssigneeDropdown;
