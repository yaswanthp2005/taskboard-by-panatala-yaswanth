const BASE_URL = "/";

const routes = {
  root: BASE_URL,
  login: `${BASE_URL}login`,
  signup: `${BASE_URL}signup`,
  boards: {
    index: BASE_URL,
    show: `${BASE_URL}:slug`,
    labels: `${BASE_URL}:slug/labels`,
    activities: `${BASE_URL}:slug/activities`,
    members: `${BASE_URL}:slug/members`,
    settings: `${BASE_URL}:slug/settings`,
  },
};

export default routes;
