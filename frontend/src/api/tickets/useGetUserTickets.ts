import { useInfiniteQuery } from "react-query";
import { InfiniteScrollResponse } from "../../types/api";
import { TICKETS_QUERY_KEYS, ticketKeys } from "./queryKeys";
import api from "../base";
import { UserTicket } from "../../types/tickets";

const getUserTickets = async (pageParam: number | undefined) => {
  const response = await api.get<InfiniteScrollResponse<UserTicket>>(
    `${TICKETS_QUERY_KEYS.TICKETS}/${TICKETS_QUERY_KEYS.ME}`,
    { params: { cursor: pageParam } }
  );
  return response.data;
};

export const useGetUserTickets = () => {
  return useInfiniteQuery(
    ticketKeys.userTickets(),
    ({ pageParam }) => getUserTickets(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor?.id,
    }
  );
};
