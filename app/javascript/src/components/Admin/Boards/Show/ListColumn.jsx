import React from "react";

import BoardView from "@bigbinary/neeto-molecules/BoardView";
import { Plus } from "neetoicons";
import { Button, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import TaskCard from "./TaskCard";

const ListColumn = ({ isDragAndDropDisabled, section }) => {
  const { t } = useTranslation();

  return (
    <div className="neeto-ui-rounded-lg flex h-full w-full flex-col bg-gray-100">
      <div className="neeto-molecules-boardview-section__header shrink-0 py-3">
        <Typography style="h5" weight="semibold">
          {section.name}
        </Typography>
      </div>
      <BoardView.Section
        isDragAndDropDisabled={isDragAndDropDisabled}
        items={section.items}
        renderItem={({ item }) => <TaskCard item={item} />}
        section={section}
      />
      <div className="shrink-0 px-4 pb-4">
        <Button icon={Plus} label={t("boardView.addCard")} style="text" />
      </div>
    </div>
  );
};

export default ListColumn;
