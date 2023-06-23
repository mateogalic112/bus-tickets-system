import { useInfiniteQuery } from "react-query";
import { InfiniteScrollResponse } from "../../types/api";
import { ActiveRoute } from "../../types/routes";
import { ROUTES_QUERY_KEYS } from "./queryKeys";
import api from "../base";

const getActiveRoutes = async (pageParam: number | undefined) => {
  const response = await api.get<InfiniteScrollResponse<ActiveRoute>>(
    `${ROUTES_QUERY_KEYS.ROUTES}`,
    { params: { cursor: pageParam } }
  );
  return response.data;
};

export const useGetActiveRoutes = () => {
  return useInfiniteQuery(
    ROUTES_QUERY_KEYS.ROUTES,
    ({ pageParam }) => getActiveRoutes(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor?.id,
    }
  );
};
