import { format } from "date-fns";
import { UserTicket } from "../types/tickets";
import { useCancelTicket } from "../api/tickets/useCancelTicket";

interface Props {
  ticket: UserTicket;
}

const UserTicketCard = ({ ticket }: Props) => {
  const cancelTicket = useCancelTicket(ticket.id);
  const handleCancelTicket = async () => {
    try {
      await cancelTicket.mutateAsync();
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="p-8 px-5">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          #{ticket.id} {ticket.name}
        </h5>
        <div className="flex gap-2 mt-2.5 mb-2 text-gray-600 dark:text-gray-400">
          <p>{format(new Date(ticket.startsAt), "dd MMMM yyyy")}</p>
          <p>
            {format(new Date(ticket.startsAt), "HH:mm")} -{" "}
            {format(new Date(ticket.endsAt), "HH:mm")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${ticket.price}
          </span>
          <button
            disabled={ticket.isCancelled}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50  disabled:bg-blue-700 "
            onClick={handleCancelTicket}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTicketCard;
