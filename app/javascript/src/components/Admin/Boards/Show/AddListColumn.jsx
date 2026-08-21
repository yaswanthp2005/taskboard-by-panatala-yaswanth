import React from "react";

import { Plus } from "neetoicons";
import { Button, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

const AddListColumn = () => {
  const { t } = useTranslation();

  return (
    <div className="neeto-ui-rounded-lg flex h-full min-h-[120px] w-[280px] shrink-0 flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 md:w-[300px] lg:w-[350px]">
      <Button icon={Plus} label={t("boardView.addList")} style="text" />
      <Typography className="mt-2 text-center text-gray-500" style="body3">
        {t("boardView.addListDescription")}
      </Typography>
    </div>
  );
};

export default AddListColumn;
