import dayjs from "dayjs";

const formatBoardUpdatedAt = updatedAt =>
  updatedAt ? dayjs(updatedAt).format("MMM D, YYYY h:mm A") : "-";

export { formatBoardUpdatedAt };
