import { keysToCamelCase } from "neetocist";
import { parse } from "qs";
import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const location = useLocation();
  const queryParams = parse(location.search, {
    comma: true,
    ignoreQueryPrefix: true,
  });

  return keysToCamelCase(queryParams);
};

export default useQueryParams;
