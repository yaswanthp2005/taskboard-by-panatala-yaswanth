import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const fetchForBoard = ({ boardSlug }) =>
  axios.get(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/activities`);

const fetchForCard = ({ cardId }) =>
  axios.get(`${ADMIN_API_BASE_URL}/cards/${cardId}/activities`);

const activitiesApi = { fetchForBoard, fetchForCard };

export default activitiesApi;
