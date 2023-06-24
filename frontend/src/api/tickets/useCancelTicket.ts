import { useMutation, useQueryClient } from "react-query";
import api from "../base";
import { AxiosError } from "axios";
import { TICKETS_QUERY_KEYS, ticketKeys } from "./queryKeys";
import toast from "react-hot-toast";
import { ROUTES_QUERY_KEYS } from "../routes/queryKeys";
import { UserTicket } from "../../types/tickets";

const cancelTicket = async (ticketId: number): Promise<UserTicket> => {
  const response = await api.patch(
    `${TICKETS_QUERY_KEYS.TICKETS}/${TICKETS_QUERY_KEYS.CANCEL}/${ticketId}`
  );
  return response.data;
};

export const useCancelTicket = (ticketId: number) => {
  const queryClient = useQueryClient();
  return useMutation(() => cancelTicket(ticketId), {
    onSuccess: (data: UserTicket) => {
      queryClient.invalidateQueries([ROUTES_QUERY_KEYS.ROUTES]);
      queryClient.invalidateQueries(ticketKeys.userTickets());

      toast.success(`Ticket #${data.id} cancelled!`);
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
