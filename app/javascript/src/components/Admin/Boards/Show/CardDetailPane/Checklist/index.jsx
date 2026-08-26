import React from "react";

import PersistedChecklistField from "./PersistedChecklistField";

const ChecklistField = ({
  boardSlug,
  cardId,
  items = [],
  onCloseWhenEmpty,
  showInput = true,
  showItemActions = true,
}) => (
  <PersistedChecklistField
    boardSlug={boardSlug}
    cardId={cardId}
    items={items}
    showInput={showInput}
    showItemActions={showItemActions}
    onCloseWhenEmpty={onCloseWhenEmpty}
  />
);

export default ChecklistField;
export { ChecklistField };
