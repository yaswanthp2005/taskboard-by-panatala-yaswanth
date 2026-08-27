import React, { useMemo } from "react";

import { useRemoveMember } from "components/hooks/reactQuery/useMembersApi";
import { NoData, Table } from "neetoui";
import { useTranslation } from "react-i18next";

import buildColumnData from "./columns";
import DeleteAlert from "./DeleteAlert";

const MembersTable = ({
  boardSlug,
  canRemoveMembers,
  currentPageNumber,
  handlePageChange,
  isLoading,
  memberToRemove,
  members,
  onCloseDeleteAlert,
  onRemove,
  pageSize,
  totalCount,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: removeMember, isLoading: isRemoving } =
    useRemoveMember(boardSlug);

  const columnData = useMemo(
    () => buildColumnData({ canRemoveMembers, onRemove, t }),
    [canRemoveMembers, onRemove, t]
  );

  const handleDeleteSubmit = async () => {
    if (!memberToRemove) {
      return;
    }

    await removeMember({ id: memberToRemove.id });
    onCloseDeleteAlert();
  };

  if (!isLoading && !members.length) {
    return <NoData title={t("members.emptyState.title")} />;
  }

  return (
    <>
      <Table
        allowRowClick={false}
        columnData={columnData}
        currentPageNumber={currentPageNumber}
        defaultPageSize={pageSize}
        enableColumnFreeze={false}
        enableColumnReorder={false}
        enableColumnResize={false}
        handlePageChange={handlePageChange}
        loading={isLoading}
        rowData={members}
        rowKey="id"
        totalCount={totalCount}
      />
      <DeleteAlert
        isDeleting={isRemoving}
        memberToRemove={memberToRemove}
        onClose={onCloseDeleteAlert}
        onSubmit={handleDeleteSubmit}
      />
    </>
  );
};

export default MembersTable;
