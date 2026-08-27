import React, { useState } from "react";

import BoardLayout from "components/Admin/Boards/Layout";
import withTitle from "utils/withTitle";

import AddMemberModal from "./AddMemberModal";
import MembersHeader from "./Header";
import useMembersTable from "./hooks/useMembersTable";
import MembersTable from "./Table";

const MembersContent = ({ board }) => {
  const {
    currentPageNumber,
    handlePageChange,
    isLoading: isMembersLoading,
    members,
    pageSize,
    totalCount,
  } = useMembersTable();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <>
      <MembersHeader
        canAddMember={board.isOwner}
        isAddDisabled={isAddModalOpen}
        onAddMember={handleOpenAddModal}
      />
      <MembersTable
        currentPageNumber={currentPageNumber}
        handlePageChange={handlePageChange}
        isLoading={isMembersLoading}
        members={members}
        pageSize={pageSize}
        totalCount={totalCount}
      />
      <AddMemberModal
        boardSlug={board.slug}
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
      />
    </>
  );
};

const Members = () => (
  <BoardLayout>{board => <MembersContent board={board} />}</BoardLayout>
);

export default withTitle(Members, "members.pageTitle");
