import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const update = ({ boardSlug, id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/${id}`, {
    list: payload,
  });

const listsApi = { update };

export default listsApi;
