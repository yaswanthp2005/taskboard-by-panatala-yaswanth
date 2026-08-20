import routes from "constants/routes";

import React from "react";

import Dashboard from "components/Admin/Boards";
import { Login, Signup } from "components/Authentication";
import { PrivateRoute, NotFound } from "components/commons";
import { QueryClientProvider } from "react-query";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import queryClient from "utils/queryClient";
import { getFromLocalStorage } from "utils/storage";

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
          <Route component={NotFound} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
