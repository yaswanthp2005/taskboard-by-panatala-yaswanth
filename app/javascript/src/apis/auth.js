import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const login = payload =>
  axios.post(`${ADMIN_API_BASE_URL}/session`, {
    login: payload,
  });

const signup = payload =>
  axios.post(`${ADMIN_API_BASE_URL}/users`, { user: payload });

const logout = () => axios.delete(`${ADMIN_API_BASE_URL}/session`);

const authApi = { login, signup, logout };

export default authApi;
