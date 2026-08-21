import React from "react";

import { Typography } from "neetoui";

const TaskCard = ({ item }) => (
  <div className="neeto-ui-rounded-md neeto-ui-shadow-xs w-full border border-gray-200 bg-white p-3">
    <Typography style="body2" weight="medium">
      {item.title}
    </Typography>
  </div>
);

export default TaskCard;
