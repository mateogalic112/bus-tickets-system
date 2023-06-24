import { useMutation, useQueryClient } from "react-query";
import { User } from "../../types/users";
import api from "../base";
import { AxiosError } from "axios";
import { TICKETS_QUERY_KEYS } from "./queryKeys";
import toast from "react-hot-toast";
import { ROUTES_QUERY_KEYS } from "../routes/queryKeys";

interface BuyTicketRequest {
  price: number;
  routeId: number;
  creditCard: string;
}

const buyTicket = async (request: BuyTicketRequest): Promise<User> => {
  const response = await api.post(`${TICKETS_QUERY_KEYS.TICKETS}`, request);
  return response.data;
};

export const useBuyTicket = () => {
  const queryClient = useQueryClient();
  return useMutation((request: BuyTicketRequest) => buyTicket(request), {
    onSuccess: () => {
      queryClient.invalidateQueries([ROUTES_QUERY_KEYS.ROUTES]);
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
