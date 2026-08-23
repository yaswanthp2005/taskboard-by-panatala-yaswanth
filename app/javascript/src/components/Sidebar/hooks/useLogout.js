import routes from "constants/routes";

import authApi from "apis/auth";
import { resetAuthTokens } from "apis/axios";
import { setToLocalStorage } from "utils/storage";

const useLogout = () => {
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      logger.error(error);
    } finally {
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = routes.login;
    }
  };

  return { handleLogout };
};

export default useLogout;
