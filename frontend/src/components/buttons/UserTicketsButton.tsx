import { useState } from "react";
import UserTicketsModal from "../modals/UserTicketsModal";

const UserTicketsButton = () => {
  const [isUserTicketsModalOpen, setIsUserTicketsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsUserTicketsModalOpen(true)}
        className="block lg:inline-block lg:mt-0  text-white mr-4"
        data-modal-target="user-tickets-modal"
        data-modal-toggle="user-tickets-modal"
      >
        My Tickets
      </button>

      <UserTicketsModal
        isOpen={isUserTicketsModalOpen}
        onClose={() => setIsUserTicketsModalOpen(false)}
      />
    </>
  );
};

export default UserTicketsButton;
