import React, { useLayoutEffect, useRef } from "react";

import { Filter, Plus, Search } from "neetoicons";
import { Button, Input, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

const BoardSubHeader = ({
  arePaneFiltersApplied,
  isAddingList,
  onAddList,
  onOpenFilters,
  onSearch,
  search,
  totalCards,
}) => {
  const { t } = useTranslation();
  const subHeaderRef = useRef(null);

  useLayoutEffect(() => {
    const updateSubHeaderHeight = () => {
      if (!subHeaderRef.current) {
        return;
      }

      document.body.style.setProperty(
        "--neeto-molecules-effective-subheader-height",
        `${subHeaderRef.current.offsetHeight}px`
      );
    };

    updateSubHeaderHeight();
    window.addEventListener("resize", updateSubHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateSubHeaderHeight);
      document.body.style.setProperty(
        "--neeto-molecules-effective-subheader-height",
        "0px"
      );
    };
  }, []);

  return (
    <div
      className="flex w-full flex-shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4 lg:px-10"
      ref={subHeaderRef}
    >
      <Typography className="shrink-0" style="h4" weight="semibold">
        {t("boardView.todoCount", { count: totalCards })}
      </Typography>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          className="w-56"
          placeholder={t("boardView.searchPlaceholder")}
          prefix={<Search />}
          value={search}
          onChange={event => onSearch(event.target.value)}
        />
        <Button
          disabled={isAddingList}
          icon={Plus}
          label={t("boardView.addList")}
          style="primary"
          onClick={onAddList}
        />
        <Button
          icon={Filter}
          style={arePaneFiltersApplied ? "primary" : "text"}
          tooltipProps={{
            content: t("boardView.filter"),
            position: "bottom",
          }}
          onClick={onOpenFilters}
        />
      </div>
    </div>
  );
};

export default BoardSubHeader;
