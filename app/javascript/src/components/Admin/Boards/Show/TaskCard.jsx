import React from "react";

import { Typography } from "neetoui";

const TaskCard = ({ item, onClick }) => (
  <div
    className="neeto-ui-rounded-md neeto-ui-shadow-xs w-full cursor-pointer border border-gray-200 bg-white p-3"
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={event => {
      if (event.key === "Enter" || event.key === " ") {
        onClick?.();
      }
    }}
  >
    <Typography style="body2" weight="medium">
      {item.title}
    </Typography>
  </div>
);

export default TaskCard;
