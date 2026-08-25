import { filterNonNull, serializeKeysToSnakeCase } from "neetocist";
import { stringify } from "qs";

const buildQueryParams = (params = {}) => {
  const { questionId, search, slug, ...rest } = params;

  return serializeKeysToSnakeCase(
    filterNonNull({
      ...rest,
      questionId: questionId?.trim?.() || null,
      search: search?.trim?.() || null,
      slug: slug?.trim?.() || null,
    })
  );
};

const buildURL = ({ path, ...params }) => {
  const {
    question_id: questionId,
    slug,
    ...queryParams
  } = buildQueryParams(params);

  let url = path.replace(":slug", slug);

  if (questionId) {
    url = url.replace(":question_id", questionId);
  }

  const queryString = stringify(filterNonNull(queryParams), {
    arrayFormat: "comma",
  });

  if (queryString) {
    url = `${url}?${queryString}`;
  }

  return url;
};

const serializeQueryParams = (params = {}) =>
  stringify(filterNonNull(params), {
    arrayFormat: "comma",
  });

export { buildQueryParams, buildURL, serializeQueryParams };
