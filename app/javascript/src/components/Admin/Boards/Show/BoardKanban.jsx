import React, { useCallback, useEffect, useState } from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";
import { useMoveCard } from "components/hooks/reactQuery/useCardsApi";
import {
  useDeleteList,
  useMoveList,
} from "components/hooks/reactQuery/useListsApi";
import PropTypes from "prop-types";

import AddListColumn from "./AddListColumn";
import CardDetailPane from "./CardDetailPane";
import DeleteListAlert from "./DeleteListAlert";
import ListColumn from "./ListColumn";
import TaskCard from "./TaskCard";
import { mapListsToSections, moveItem, moveSection } from "./utils";

const BoardKanban = ({ boardSlug, lists = [] }) => {
  const [sections, setSections] = useState(() => mapListsToSections(lists));
  const [listToDelete, setListToDelete] = useState(null);
  const [cardPane, setCardPane] = useState(null);
  const { mutateAsync: moveList } = useMoveList(boardSlug);
  const { mutateAsync: moveCard } = useMoveCard(boardSlug);
  const { mutateAsync: deleteList, isLoading: isDeletingList } =
    useDeleteList(boardSlug);

  useEffect(() => {
    setSections(mapListsToSections(lists));
  }, [lists]);

  const handleMoveSection = useCallback(
    async (source, destination) => {
      const previousSections = sections;
      const nextSections = moveSection(sections, source, destination);

      setSections(nextSections);

      const movedListId = previousSections[source.index]?.id;

      if (!movedListId) {
        return;
      }

      try {
        await moveList({
          id: movedListId,
          position: destination.index + 1,
        });
      } catch (error) {
        setSections(previousSections);
        logger.error(error);
      }
    },
    [moveList, sections]
  );

  const handleMoveItem = useCallback(
    async (source, destination) => {
      const previousSections = sections;
      const nextSections = moveItem(sections, source, destination);

      setSections(nextSections);

      const movedCardId = previousSections.find(
        section => section.id === source.section.id
      )?.items[source.index]?.id;

      if (!movedCardId) {
        return;
      }

      try {
        await moveCard({
          id: movedCardId,
          listId: destination.section.id,
          position: destination.index + 1,
        });
      } catch (error) {
        setSections(previousSections);
        logger.error(error);
      }
    },
    [moveCard, sections]
  );

  const handleDeleteList = async () => {
    if (!listToDelete) {
      return;
    }

    try {
      await deleteList({ id: listToDelete.id });
      setListToDelete(null);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <div className="flex h-full min-h-0 w-full items-start gap-x-3 overflow-x-auto pb-4 pt-4">
        <BoardView
          className="h-full items-start"
          renderItemOverlay={({ item }) => <TaskCard item={item} />}
          sections={sections}
          renderSection={({ section, isDragAndDropDisabled }) => (
            <ListColumn
              boardSlug={boardSlug}
              isDragAndDropDisabled={isDragAndDropDisabled}
              section={section}
              onAddCard={listId => setCardPane({ type: "create", listId })}
              onDelete={setListToDelete}
              onCardClick={item =>
                setCardPane({ type: "edit", cardId: item.id })
              }
            />
          )}
          renderSectionOverlay={({ section }) => (
            <ListColumn
              isDragAndDropDisabled
              boardSlug={boardSlug}
              section={section}
            />
          )}
          onMoveItem={handleMoveItem}
          onMoveSection={handleMoveSection}
        />
        <AddListColumn />
      </div>
      <DeleteListAlert
        isDeleting={isDeletingList}
        listToDelete={listToDelete}
        onClose={() => setListToDelete(null)}
        onSubmit={handleDeleteList}
      />
      <CardDetailPane
        boardSlug={boardSlug}
        cardId={cardPane?.type === "edit" ? cardPane.cardId : null}
        isOpen={Boolean(cardPane)}
        listId={cardPane?.type === "create" ? cardPane.listId : null}
        onClose={() => setCardPane(null)}
      />
    </>
  );
};

BoardKanban.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  lists: PropTypes.array,
};

export default BoardKanban;
