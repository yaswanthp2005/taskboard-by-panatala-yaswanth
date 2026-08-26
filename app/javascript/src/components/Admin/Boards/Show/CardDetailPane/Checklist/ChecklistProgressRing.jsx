import React from "react";

import PropTypes from "prop-types";

const ChecklistProgressRing = ({ percent }) => {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg
      aria-hidden
      className="shrink-0"
      height="18"
      viewBox="0 0 18 18"
      width="18"
    >
      <circle
        className="stroke-gray-300"
        cx="9"
        cy="9"
        fill="none"
        r={radius}
        strokeWidth="2"
      />
      <circle
        className="stroke-green-600 transition-all"
        cx="9"
        cy="9"
        fill="none"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth="2"
        transform="rotate(-90 9 9)"
      />
    </svg>
  );
};

ChecklistProgressRing.propTypes = {
  percent: PropTypes.number.isRequired,
};

export default ChecklistProgressRing;
