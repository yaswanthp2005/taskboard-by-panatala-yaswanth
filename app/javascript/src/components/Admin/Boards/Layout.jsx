import React from "react";

import Container from "@bigbinary/neeto-molecules/Container";
import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import { BoardNavHeader } from "components/Admin/Boards/Show/Header";
import { NotFound } from "components/commons";
import { useBoardPage } from "components/hooks/reactQuery/useBoardsApi";
import Sidebar from "components/Sidebar";
import { Spinner } from "neetoui";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

const BoardLayout = ({ children }) => {
  const { slug } = useParams();
  const { board, isLoading, isNotFound } = useBoardPage(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isNotFound) {
    return <NotFound />;
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
            <div className="px-5 py-6 lg:px-10">{children(board)}</div>
          </Scrollable>
        </Container>
      </main>
    </div>
  );
};

BoardLayout.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BoardLayout;
