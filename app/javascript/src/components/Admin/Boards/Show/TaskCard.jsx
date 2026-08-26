import React from "react";

import dayjs from "dayjs";
import { Calendar, MenuHorizontal } from "neetoicons";
import { Dropdown, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import AssigneePicker from "./AssigneePicker";

const formatDueDate = dueDate =>
  dueDate ? dayjs(dueDate).format("D MMM") : null;

const TaskCard = ({ boardSlug, item, onClick, onDelete, onEdit }) => {
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
          style="body2"
          weight="medium"
          className={`min-w-0 flex-1 break-words ${
            item.isComplete ? "text-gray-400 line-through" : ""
          }`}
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
      {item.labels?.length > 0 && (
        <div className="mt-2 flex w-full flex-wrap gap-1.5">
          {item.labels.map(label => (
            <span
              className="max-w-full truncate rounded px-2 py-0.5 text-xs font-medium text-white"
              key={label.id}
              style={{ backgroundColor: label.color }}
              title={label.name}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-x-2 pt-3">
        {formattedDueDate ? (
          <div className="flex items-center gap-x-1 text-gray-500">
            <Calendar size={14} />
            <Typography style="body3">{formattedDueDate}</Typography>
          </div>
        ) : (
          <span />
        )}
        <AssigneePicker
          assignees={item.assignees ?? []}
          boardSlug={boardSlug}
          cardId={item.id}
        />
      </div>
    </div>
  );
};

export default TaskCard;
