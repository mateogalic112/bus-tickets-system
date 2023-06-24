import { format } from "date-fns";
import { ActiveRoute } from "../../types/routes";
import { useGetCurrentUser } from "../../api/users/useGetCurrentUser";
import BuyTicketModal from "../modals/BuyTicketModal";
import { useState } from "react";

interface Props {
  route: ActiveRoute;
}

const RouteCard = ({ route }: Props) => {
  const { data: user } = useGetCurrentUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="p-8 px-5">
        <h6 className="text-gray-500 pb-2">{route.transporter}</h6>
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {route.name}
        </h5>
        <div className="flex gap-2 mt-2.5 mb-2 text-gray-600 dark:text-gray-400">
          <p>{format(new Date(route.startsAt), "dd MMMM yyyy")}</p>
          <p>
            {format(new Date(route.startsAt), "HH:mm")} -{" "}
            {format(new Date(route.endsAt), "HH:mm")}
          </p>
        </div>
        <p className="text-gray-300 mb-2">
          {route.maxTickets - route.ticketCount} tickets left
        </p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${parseFloat(route.basePrice).toFixed(2)}
          </span>
          <button
            disabled={route.maxTickets - route.ticketCount === 0 || !user}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50  disabled:bg-blue-700 "
            onClick={() => setIsLoginModalOpen(true)}
          >
            Buy
          </button>

          <BuyTicketModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            route={route}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
