import routes from "constants/routes";

import React from "react";

import ErrorPage from "@bigbinary/neeto-molecules/ErrorPage";

const NotFound = () => (
  <ErrorPage homeUrl={routes.root} showNeetoChatWidget={false} status={404} />
);

export default NotFound;
