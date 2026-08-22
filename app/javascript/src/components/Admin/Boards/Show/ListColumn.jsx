import React from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";
import { MenuHorizontal, Plus } from "neetoicons";
import { Button, Dropdown } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ListTitle from "./ListTitle";
import TaskCard from "./TaskCard";

const ListColumn = ({
  boardSlug,
  isDragAndDropDisabled,
  onAddCard,
  onCardClick,
  onDelete,
  section,
}) => {
  const { t } = useTranslation();

  const handleAddCard = () => {
    onAddCard?.(section.id);
  };

  const handleDelete = () => {
    onDelete?.({ id: section.id, name: section.name });
  };

  return (
    <div className="neeto-ui-rounded-lg flex h-full w-full flex-col bg-gray-100">
      <div className="neeto-molecules-boardview-section__header flex shrink-0 items-start justify-between gap-x-2 py-3">
        <ListTitle
          boardSlug={boardSlug}
          listId={section.id}
          title={section.name}
        />
        {onDelete && (
          <Dropdown
            buttonProps={{ className: "shrink-0" }}
            icon={MenuHorizontal}
            label=""
            position="bottom-end"
            strategy="fixed"
          >
            <Dropdown.Menu>
              <Dropdown.MenuItem onClick={handleDelete}>
                {t("boardView.deleteList.action")}
              </Dropdown.MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <BoardView.Section
        isDragAndDropDisabled={isDragAndDropDisabled}
        items={section.items}
        section={section}
        renderItem={({ item }) => (
          <TaskCard item={item} onClick={() => onCardClick?.(item)} />
        )}
      />
      <div className="shrink-0 px-4 pb-4">
        <Button
          icon={Plus}
          label={t("boardView.addCard")}
          style="text"
          onClick={handleAddCard}
        />
      </div>
    </div>
  );
};

ListColumn.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  isDragAndDropDisabled: PropTypes.bool,
  onAddCard: PropTypes.func,
  onCardClick: PropTypes.func,
  onDelete: PropTypes.func,
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.array,
  }).isRequired,
};

ListColumn.defaultProps = {
  isDragAndDropDisabled: false,
  onAddCard: undefined,
  onCardClick: undefined,
  onDelete: undefined,
};

export default ListColumn;
