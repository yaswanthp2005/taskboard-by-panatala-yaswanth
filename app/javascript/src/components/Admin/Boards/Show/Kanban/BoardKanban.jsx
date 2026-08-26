import React, { useCallback, useEffect, useState } from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";
import {
  useDeleteCard,
  useMoveCard,
} from "components/hooks/reactQuery/useCardsApi";
import {
  useDeleteList,
  useMoveList,
} from "components/hooks/reactQuery/useListsApi";

import AddListColumn from "./AddListColumn";
import DeleteListAlert from "./DeleteListAlert";
import ListColumn from "./ListColumn";
import TaskCard from "./TaskCard";

import CardDetailPane from "../CardDetailPane";
import { DeleteCardAlert } from "../CardDetailPane/Alerts";
import { mapListsToSections, moveItem, moveSection } from "../utils";

const BoardKanban = ({
  boardName,
  boardSlug,
  isAddingList,
  isFetching,
  lists = [],
  onCancelAddList,
}) => {
  const [sections, setSections] = useState(() => mapListsToSections(lists));
  const [listToDelete, setListToDelete] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [cardPane, setCardPane] = useState(null);
  const { mutateAsync: moveList } = useMoveList(boardSlug);
  const { mutateAsync: moveCard } = useMoveCard(boardSlug);
  const { mutateAsync: deleteCard, isLoading: isDeletingCard } =
    useDeleteCard(boardSlug);

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

  const handleDeleteCard = async () => {
    if (!cardToDelete) {
      return;
    }

    try {
      await deleteCard({ id: cardToDelete.id });
      setCardToDelete(null);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleRequestDeleteCard = card => {
    if (cardPane?.type === "show" && cardPane.cardId === card.id) {
      setCardPane(null);
    }

    setCardToDelete(card);
  };

  return (
    <>
      <div
        className={`flex h-full min-h-0 w-full min-w-0 items-start gap-x-3 overflow-x-auto px-5 pb-4 pt-2 transition-opacity lg:px-10 ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        <BoardView
          className="h-full items-start"
          sections={sections}
          renderItemOverlay={({ item }) => (
            <TaskCard boardSlug={boardSlug} item={item} />
          )}
          renderSection={({ section, isDragAndDropDisabled }) => (
            <ListColumn
              boardSlug={boardSlug}
              isDragAndDropDisabled={isDragAndDropDisabled}
              section={section}
              onAddCard={listId => setCardPane({ type: "create", listId })}
              onCardDelete={handleRequestDeleteCard}
              onDelete={setListToDelete}
              onCardClick={item =>
                setCardPane({ type: "show", cardId: item.id, isEditing: false })
              }
              onCardEdit={item =>
                setCardPane({ type: "show", cardId: item.id, isEditing: true })
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
        {isAddingList && (
          <AddListColumn
            boardSlug={boardSlug}
            onCancel={onCancelAddList}
            onCreated={onCancelAddList}
          />
        )}
      </div>
      <DeleteListAlert
        isDeleting={isDeletingList}
        listToDelete={listToDelete}
        onClose={() => setListToDelete(null)}
        onSubmit={handleDeleteList}
      />
      <DeleteCardAlert
        cardToDelete={cardToDelete}
        isDeleting={isDeletingCard}
        onClose={() => setCardToDelete(null)}
        onSubmit={handleDeleteCard}
      />
      <CardDetailPane
        boardName={boardName}
        boardSlug={boardSlug}
        cardId={cardPane?.type === "show" ? cardPane.cardId : null}
        initialEditing={cardPane?.isEditing ?? false}
        isOpen={Boolean(cardPane)}
        listId={cardPane?.type === "create" ? cardPane.listId : null}
        onClose={() => setCardPane(null)}
        onDelete={handleRequestDeleteCard}
      />
    </>
  );
};

export default BoardKanban;
