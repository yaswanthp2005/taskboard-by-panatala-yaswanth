import React from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";
import { useCreateCard } from "components/hooks/reactQuery/useCardsApi";
import { Plus } from "neetoicons";
import { Button } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ListTitle from "./ListTitle";
import TaskCard from "./TaskCard";

const ListColumn = ({ boardSlug, isDragAndDropDisabled, section }) => {
  const { t } = useTranslation();
  const { mutateAsync: createCard, isLoading: isCreatingCard } =
    useCreateCard(boardSlug);

  const handleAddCard = async () => {
    try {
      await createCard({
        listId: section.id,
        title: t("boardView.defaultCardTitle"),
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="neeto-ui-rounded-lg flex h-full w-full flex-col bg-gray-100">
      <div className="neeto-molecules-boardview-section__header shrink-0 py-3">
        <ListTitle
          boardSlug={boardSlug}
          listId={section.id}
          title={section.name}
        />
      </div>
      <BoardView.Section
        isDragAndDropDisabled={isDragAndDropDisabled}
        items={section.items}
        renderItem={({ item }) => <TaskCard item={item} />}
        section={section}
      />
      <div className="shrink-0 px-4 pb-4">
        <Button
          disabled={isCreatingCard}
          icon={Plus}
          label={t("boardView.addCard")}
          loading={isCreatingCard}
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
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.array,
  }).isRequired,
};

export default ListColumn;
