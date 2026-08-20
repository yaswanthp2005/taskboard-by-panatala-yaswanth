import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const fetch = params => axios.get(`${ADMIN_API_BASE_URL}/boards`, { params });

const create = payload =>
  axios.post(`${ADMIN_API_BASE_URL}/boards`, { board: payload });

const boardsApi = { create, fetch };

export default boardsApi;
