import React, { useCallback, useEffect, useState } from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";

import AddListColumn from "./AddListColumn";
import ListColumn from "./ListColumn";
import TaskCard from "./TaskCard";
import { mapListsToSections, moveItem, moveSection } from "./utils";

const BoardKanban = ({ lists = [] }) => {
  const [sections, setSections] = useState(() => mapListsToSections(lists));

  useEffect(() => {
    setSections(mapListsToSections(lists));
  }, [lists]);

  const handleMoveSection = useCallback((source, destination) => {
    setSections(currentSections =>
      moveSection(currentSections, source, destination)
    );
  }, []);

  const handleMoveItem = useCallback((source, destination) => {
    setSections(currentSections =>
      moveItem(currentSections, source, destination)
    );
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full items-start gap-x-3 overflow-x-auto pb-4 pt-4">
      <BoardView
        className="h-full items-start"
        renderItemOverlay={({ item }) => <TaskCard item={item} />}
        sections={sections}
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
