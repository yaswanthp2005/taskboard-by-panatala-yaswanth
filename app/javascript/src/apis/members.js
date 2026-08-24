import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const fetch = ({ boardSlug }) =>
  axios.get(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/members`);

const membersApi = { fetch };

export default membersApi;
