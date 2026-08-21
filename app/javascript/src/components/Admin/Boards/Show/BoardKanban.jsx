import React, { useCallback, useState } from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";

import AddListColumn from "./AddListColumn";
import { buildInitialLists } from "./constants";
import ListColumn from "./ListColumn";
import TaskCard from "./TaskCard";
import { moveItem, moveSection } from "./utils";

const BoardKanban = () => {
  const [lists, setLists] = useState(buildInitialLists);

  const handleMoveSection = useCallback((source, destination) => {
    setLists(currentLists => moveSection(currentLists, source, destination));
  }, []);

  const handleMoveItem = useCallback((source, destination) => {
    setLists(currentLists => moveItem(currentLists, source, destination));
  }, []);

  return (
    <div className="flex min-h-0 flex-1 gap-x-3 overflow-x-auto pb-4">
      <BoardView
        className="min-h-[calc(100vh-12rem)] items-start"
        renderItemOverlay={({ item }) => <TaskCard item={item} />}
        sections={lists}
        renderSection={({ section, isDragAndDropDisabled }) => (
          <ListColumn
            isDragAndDropDisabled={isDragAndDropDisabled}
            section={section}
          />
        )}
        renderSectionOverlay={({ section }) => (
          <ListColumn isDragAndDropDisabled section={section} />
        )}
        onMoveItem={handleMoveItem}
        onMoveSection={handleMoveSection}
      />
      <AddListColumn />
    </div>
  );
};

export default BoardKanban;
