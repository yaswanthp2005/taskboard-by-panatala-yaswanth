import routes from "constants/routes";

import React, { Suspense, lazy } from "react";

import Dashboard from "components/Admin/Boards";
import { Login, Signup } from "components/Authentication";
import { PrivateRoute, NotFound } from "components/commons";
import { Spinner } from "neetoui";
import { QueryClientProvider } from "react-query";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import queryClient from "utils/queryClient";
import { getFromLocalStorage } from "utils/storage";

const BoardShow = lazy(() => import("components/Admin/Boards/Show"));
const BoardLabels = lazy(() => import("components/Admin/Boards/Labels"));
const BoardActivities = lazy(() =>
  import("components/Admin/Boards/Activities")
);

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = Boolean(authToken);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastContainer />
        <Switch>
          <Route exact component={Login} path={routes.login} />
          <Route exact component={Signup} path={routes.signup} />
          <PrivateRoute
            exact
            component={Dashboard}
            condition={isLoggedIn}
            path={routes.boards.index}
            redirectRoute={routes.login}
          />
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <PrivateRoute
              exact
              component={BoardLabels}
              condition={isLoggedIn}
              path={routes.boards.labels}
              redirectRoute={routes.login}
            />
            <PrivateRoute
              exact
              component={BoardActivities}
              condition={isLoggedIn}
              path={routes.boards.activities}
              redirectRoute={routes.login}
            />
            <PrivateRoute
              exact
              component={BoardShow}
              condition={isLoggedIn}
              path={routes.boards.show}
              redirectRoute={routes.login}
            />
          </Suspense>
          <Route component={NotFound} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
