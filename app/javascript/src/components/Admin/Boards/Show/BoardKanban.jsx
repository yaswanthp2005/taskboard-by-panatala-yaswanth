import React, { useCallback, useEffect, useState } from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";
import {
  useDeleteList,
  useReorderLists,
} from "components/hooks/reactQuery/useListsApi";
import PropTypes from "prop-types";

import AddListColumn from "./AddListColumn";
import DeleteListAlert from "./DeleteListAlert";
import ListColumn from "./ListColumn";
import TaskCard from "./TaskCard";
import { mapListsToSections, moveItem, moveSection } from "./utils";

const BoardKanban = ({ boardSlug, lists = [] }) => {
  const [sections, setSections] = useState(() => mapListsToSections(lists));
  const [listToDelete, setListToDelete] = useState(null);
  const { mutateAsync: reorderLists } = useReorderLists(boardSlug);
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

      try {
        await reorderLists({
          listIds: nextSections.map(section => section.id),
        });
      } catch (error) {
        setSections(previousSections);
        logger.error(error);
      }
    },
    [reorderLists, sections]
  );

  const handleMoveItem = useCallback((source, destination) => {
    setSections(currentSections =>
      moveItem(currentSections, source, destination)
    );
  }, []);

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
              onDelete={setListToDelete}
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
    </>
  );
};

BoardKanban.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  lists: PropTypes.array,
};

export default BoardKanban;
