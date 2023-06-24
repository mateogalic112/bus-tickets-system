import { useMutation, useQueryClient } from "react-query";
import api from "../base";
import { AxiosError } from "axios";
import { TICKETS_QUERY_KEYS } from "./queryKeys";
import toast from "react-hot-toast";
import { ROUTES_QUERY_KEYS } from "../routes/queryKeys";
import { UserTicket } from "../../types/tickets";

interface BuyTicketRequest {
  price: number;
  routeId: number;
  creditCard: string;
}

const buyTicket = async (request: BuyTicketRequest): Promise<UserTicket> => {
  const response = await api.post(`${TICKETS_QUERY_KEYS.TICKETS}`, request);
  return response.data;
};

export const useBuyTicket = () => {
  const queryClient = useQueryClient();
  return useMutation((request: BuyTicketRequest) => buyTicket(request), {
    onSuccess: (data: UserTicket) => {
      queryClient.invalidateQueries([ROUTES_QUERY_KEYS.ROUTES]);
      toast.success(`Ticket #${data.id} bought for $${data.price}`);
    },
    onError: (e: AxiosError) => {
      const safeError = e?.response?.data as {
        message: string;
        status: number;
      };
      toast.error(safeError.message);
    },
  });
};
