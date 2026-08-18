import routes from "constants/routes";

import React from "react";

import { Login, Signup } from "components/Authentication";
import { PrivateRoute, NotFound } from "components/commons";
import Home from "components/Home";
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
            component={Home}
            condition={isLoggedIn}
            path={routes.root}
            redirectRoute={routes.login}
          />
          {/* <Redirect
            exact
            from={routes.settings.index}
            to={routes.settings.general}
          /> */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
