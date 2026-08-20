import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const fetch = params => axios.get(`${ADMIN_API_BASE_URL}/boards`, { params });

const boardsApi = { fetch };

export default boardsApi;
