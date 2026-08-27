import routes from "constants/routes";

import authApi from "apis/auth";
import { setAuthHeaders } from "apis/axios";
import camelToSnake from "utils/camelToSnake";
import { setToLocalStorage } from "utils/storage";

const handleSignupSubmit = async (values, { setSubmitting }, history) => {
  try {
    await authApi.signup(camelToSnake(values));
    history.push(routes.login);
  } catch (error) {
    logger.error(error);
  } finally {
    setSubmitting(false);
  }
};

const handleLoginSubmit = async (values, { setSubmitting }) => {
  try {
    const response = await authApi.login(camelToSnake(values));
    const userName = [response.data.firstName, response.data.lastName]
      .filter(Boolean)
      .join(" ");

    setToLocalStorage({
      authToken: response.data.authenticationToken,
      email: response.data.email,
      userId: response.data.id,
      userName,
    });
    setAuthHeaders();

    const invitationRedirect = sessionStorage.getItem("invitationRedirect");

    if (invitationRedirect) {
      sessionStorage.removeItem("invitationRedirect");
      window.location.href = invitationRedirect;
    } else {
      window.location.href = routes.root;
    }
  } catch (error) {
    logger.error(error);
  } finally {
    setSubmitting(false);
  }
};

export { handleLoginSubmit, handleSignupSubmit };
