import React from "react";

import { Typography } from "neetoui";

const ColorCell = ({ color }) => (
  <div className="flex items-center gap-x-2">
    <span
      aria-hidden
      className="inline-block h-4 w-4 shrink-0 rounded-full border border-gray-200"
      style={{ backgroundColor: color }}
    />
    <Typography style="body2">{color}</Typography>
  </div>
);

export default ColorCell;
