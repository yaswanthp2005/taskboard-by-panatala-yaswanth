import axios from "axios";
import i18n from "common/i18n";
import { keysToCamelCase } from "neetocist";
import { Toastr } from "neetoui";
import { getFromLocalStorage, setToLocalStorage } from "utils/storage";

axios.defaults.baseURL = "/";

const setAuthHeaders = () => {
  axios.defaults.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document
      .querySelector('[name="csrf-token"]')
      .getAttribute("content"),
  };

  const token = getFromLocalStorage("authToken");
  const email = getFromLocalStorage("authEmail");

  if (token && email) {
    axios.defaults.headers["X-Auth-Email"] = email;
    axios.defaults.headers["X-Auth-Token"] = token;
  }
};

const resetAuthTokens = () => {
  delete axios.defaults.headers["X-Auth-Email"];
  delete axios.defaults.headers["X-Auth-Token"];
};

const handleSuccessResponse = response => {
  if (response?.data) {
    const isBlobResponse = response.data instanceof Blob;

    if (!isBlobResponse) {
      response.data = keysToCamelCase(response.data);
    }

    response.success = response.status === 200;

    if (!isBlobResponse && response.data.notice) {
      Toastr.success(response.data.notice);
    }
  }

  return response;
};

const handleErrorResponse = axiosErrorObject => {
  if (axiosErrorObject.response?.status === 401) {
    setToLocalStorage({
      authToken: null,
      email: null,
      role: null,
      userId: null,
      userName: null,
    });
    resetAuthTokens();
  }

  if (axiosErrorObject.response?.data) {
    axiosErrorObject.response.data = keysToCamelCase(
      axiosErrorObject.response.data
    );
  }

  if (!axiosErrorObject.config?.skipErrorToast) {
    Toastr.error(
      axiosErrorObject.response?.data?.error ||
        i18n.t("common.somethingWentWrong")
    );
  }

  return Promise.reject(axiosErrorObject);
};

const registerIntercepts = () => {
  axios.interceptors.response.use(handleSuccessResponse, error =>
    handleErrorResponse(error)
  );
};

export { resetAuthTokens, setAuthHeaders, registerIntercepts };
