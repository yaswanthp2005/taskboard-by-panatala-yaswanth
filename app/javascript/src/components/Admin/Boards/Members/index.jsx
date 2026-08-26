import React, { useState } from "react";

import Container from "@bigbinary/neeto-molecules/Container";
import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import { BoardNavHeader } from "components/Admin/Boards/Show/Header";
import { useFetchBoard } from "components/hooks/reactQuery/useBoardsApi";
import Sidebar from "components/Sidebar";
import { Spinner, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import withTitle from "utils/withTitle";

import AddMemberModal from "./AddMemberModal";
import MembersHeader from "./Header";
import useMembersTable from "./hooks/useMembersTable";
import MembersTable from "./Table";

const Members = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const {
    data: board,
    isError: isBoardError,
    isLoading: isBoardLoading,
  } = useFetchBoard(slug);

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

  if (isBoardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isBoardError || !board) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Typography style="body1">{t("common.somethingWentWrong")}</Typography>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Container
          isHeaderFixed
          className="!h-full min-h-0 flex-1 !overflow-hidden"
        >
          <BoardNavHeader board={board} />
          <Scrollable className="flex min-h-0 flex-1 flex-col" size="medium">
            <div className="px-5 py-6 lg:px-10">
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
            </div>
          </Scrollable>
        </Container>
      </main>
      <AddMemberModal
        boardSlug={board.slug}
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
      />
    </div>
  );
};

export default withTitle(Members, "members.pageTitle");
