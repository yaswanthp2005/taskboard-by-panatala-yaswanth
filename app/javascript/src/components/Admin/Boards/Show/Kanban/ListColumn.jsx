import React from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";
import { MenuHorizontal, Plus } from "neetoicons";
import { Button, Dropdown, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import ListTitle from "./ListTitle";
import TaskCard from "./TaskCard";

const ListColumn = ({
  boardSlug,
  isDragAndDropDisabled,
  onAddCard,
  onCardClick,
  onCardDelete,
  onCardEdit,
  onDelete,
  section,
}) => {
  const { t } = useTranslation();
  const cardCount = section.items?.length ?? 0;

  const handleAddCard = () => {
    onAddCard?.(section.id);
  };

  const handleDelete = () => {
    onDelete?.({ id: section.id, name: section.name });
  };

  return (
    <div className="neeto-ui-rounded-xl flex h-full min-h-0 w-full flex-col bg-gray-100">
      <div className="neeto-molecules-boardview-section__header flex shrink-0 items-center justify-between gap-x-2 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-x-2">
          <ListTitle
            boardSlug={boardSlug}
            listId={section.id}
            title={section.name}
          />
          <Typography
            className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-gray-200 px-1.5 text-gray-600"
            style="body3"
            weight="medium"
          >
            {cardCount}
          </Typography>
        </div>
        {onDelete && (
          <Dropdown
            buttonProps={{ className: "shrink-0", style: "text" }}
            dropdownProps={{ appendTo: () => document.body }}
            icon={MenuHorizontal}
            label=""
            position="bottom-end"
            strategy="fixed"
          >
            <Dropdown.Menu>
              <Dropdown.MenuItem.Button style="danger" onClick={handleDelete}>
                {t("boardView.deleteList.action")}
              </Dropdown.MenuItem.Button>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <BoardView.Section
        isDragAndDropDisabled={isDragAndDropDisabled}
        items={section.items}
        section={section}
        renderItem={({ item }) => (
          <TaskCard
            boardSlug={boardSlug}
            item={item}
            onClick={() => onCardClick?.(item)}
            onDelete={onCardDelete}
            onEdit={onCardEdit}
          />
        )}
      />
      <div className="flex shrink-0 justify-center px-4 pb-4 pt-1">
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

export default ListColumn;
