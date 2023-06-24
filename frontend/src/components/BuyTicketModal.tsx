import { useState } from "react";
import { useGetCurrentUser } from "../api/users/useGetCurrentUser";
import { useBuyTicket } from "../api/tickets/useBuyTicket";
import { ActiveRoute } from "../types/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  route: ActiveRoute;
}

const BuyTicketModal = ({ isOpen, onClose, route }: Props) => {
  const { data: user } = useGetCurrentUser();
  const [creditCard, setCreditCard] = useState("");

  const buyTicket = useBuyTicket();
  const handleBuyTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await buyTicket.mutateAsync({
        price: +route.basePrice,
        routeId: route.id,
        creditCard,
      });
      onClose();
    } catch (err) {
      console.log({ err });
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div
      id="defaultModal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Buy ticket
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal"
              onClick={onClose}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <form
              id="buy-ticket-form"
              className="space-y-6"
              onSubmit={handleBuyTicket}
            >
              <div>
                <p className="text-gray-200">
                  Name: {user.firstName + " " + user.lastName}
                </p>
                <p className="text-gray-200 mb-2">Email: {user.email}</p>
                <label
                  htmlFor="creditCard"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your credit card
                </label>
                <input
                  type="text"
                  name="creditCard"
                  id="creditCard"
                  onChange={(event) => setCreditCard(event.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="5678 ****"
                  required
                />
              </div>
            </form>
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              data-modal-hide="defaultModal"
              type="submit"
              form="buy-ticket-form"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
            <button
              data-modal-hide="defaultModal"
              type="button"
              onClick={onClose}
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTicketModal;
