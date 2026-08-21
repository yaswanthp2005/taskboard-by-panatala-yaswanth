import React from "react";

import { MenuHorizontal } from "neetoicons";
import { Button, Dropdown, Tooltip, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import { formatBoardUpdatedAt, getTruncatedText } from "../utils";

const BoardTile = ({ board, onDelete, onOpen, onRename }) => {
  const { t } = useTranslation();
  const { displayText: description, isTruncated } = getTruncatedText(
    board.description,
    100
  );

  const descriptionElement = (
    <Typography className="text-gray-600" style="body2">
      {description}
    </Typography>
  );

  return (
    <div
      className="neeto-ui-rounded-lg neeto-ui-shadow-xs group relative flex h-full min-h-[168px] cursor-pointer flex-col overflow-hidden border border-gray-200 bg-white transition-shadow hover:shadow-md"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(board)}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(board);
        }
      }}
    >
      <div
        className="h-2 w-full shrink-0"
        style={{ backgroundColor: board.color || "#4F46E5" }}
      />
      <div className="flex flex-1 flex-col gap-y-2 p-4">
        <div className="flex items-start justify-between gap-x-2">
          <Typography
            className="line-clamp-2 flex-1"
            style="h4"
            weight="semibold"
          >
            {board.name}
          </Typography>
          {board.isOwner && (
            <div
              className="opacity-0 transition-opacity group-hover:opacity-100"
              onClick={event => event.stopPropagation()}
            >
              <Dropdown
                buttonStyle="text"
                dropdownProps={{ appendTo: () => document.body }}
                strategy="fixed"
                customTarget={
                  <Button
                    icon={MenuHorizontal}
                    iconSize={20}
                    style="text"
                    tooltipProps={{ content: t("boards.actions.menu") }}
                  />
                }
              >
                <Dropdown.Menu>
                  <Dropdown.MenuItem.Button onClick={() => onRename(board)}>
                    {t("boards.actions.rename")}
                  </Dropdown.MenuItem.Button>
                  <Dropdown.MenuItem.Button
                    style="danger"
                    onClick={() => onDelete(board)}
                  >
                    {t("boards.actions.delete")}
                  </Dropdown.MenuItem.Button>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>
        {isTruncated ? (
          <Tooltip content={board.description}>{descriptionElement}</Tooltip>
        ) : (
          descriptionElement
        )}
        <Typography className="mt-auto text-gray-500" style="body3">
          {formatBoardUpdatedAt(board.updatedAt)}
        </Typography>
      </div>
    </div>
  );
};

export default BoardTile;
