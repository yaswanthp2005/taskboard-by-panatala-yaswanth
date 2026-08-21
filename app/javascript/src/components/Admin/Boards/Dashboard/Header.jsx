import React from "react";

import { Search } from "neetoicons";
import { Button, Input, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

const DashboardHeader = ({ onAddBoard, onSearch, search }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-y-2">
        <Typography style="h2" weight="semibold">
          {t("boards.title")}
        </Typography>
        <Typography style="body2">{t("boards.subtitle")}</Typography>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          className="w-64"
          placeholder={t("boards.searchPlaceholder")}
          prefix={<Search />}
          value={search}
          onChange={event => onSearch(event.target.value)}
        />
        <Button
          label={t("boards.createBoard")}
          style="primary"
          onClick={onAddBoard}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
