import React from "react";

import dayjs from "dayjs";
import { Calendar, MenuHorizontal, UserAdd } from "neetoicons";
import { Dropdown, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const formatDueDate = dueDate =>
  dueDate ? dayjs(dueDate).format("D MMM") : null;

const TaskCard = ({ item, onClick, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const formattedDueDate = formatDueDate(item.dueDate);

  const handleMenuClick = event => {
    event.stopPropagation();
  };

  return (
    <div
      className="neeto-ui-rounded-lg neeto-ui-shadow-xs flex w-full cursor-pointer flex-col border border-gray-200 bg-white p-3"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className="flex items-start justify-between gap-x-2">
        <Typography
          className="min-w-0 flex-1 truncate"
          style="body2"
          weight="medium"
        >
          {item.title}
        </Typography>
        <span
          className="shrink-0"
          role="presentation"
          onClick={handleMenuClick}
        >
          <Dropdown
            buttonProps={{ className: "shrink-0", iconSize: 16, style: "text" }}
            dropdownProps={{ appendTo: () => document.body }}
            icon={MenuHorizontal}
            label=""
            position="bottom-end"
            strategy="fixed"
          >
            <Dropdown.Menu>
              <Dropdown.MenuItem.Button onClick={() => onEdit?.(item)}>
                {t("cardDetail.edit")}
              </Dropdown.MenuItem.Button>
              <Dropdown.MenuItem.Button
                style="danger"
                onClick={() => onDelete?.(item)}
              >
                {t("cardDetail.delete.action")}
              </Dropdown.MenuItem.Button>
            </Dropdown.Menu>
          </Dropdown>
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-x-2 pt-3">
        {formattedDueDate ? (
          <div className="flex items-center gap-x-1 text-gray-500">
            <Calendar size={14} />
            <Typography style="body3">{formattedDueDate}</Typography>
          </div>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-gray-400">
          <UserAdd size={16} />
        </span>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

TaskCard.defaultProps = {
  onClick: undefined,
  onDelete: undefined,
  onEdit: undefined,
};

export default TaskCard;
