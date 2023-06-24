import { useState } from "react";
import { useGetCurrentUser } from "../../api/users/useGetCurrentUser";
import LoginModal from "../modals/LoginModal";

const LoginButton = () => {
  const { isLoading } = useGetCurrentUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <button
        data-modal-target="login-modal"
        data-modal-toggle="login-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setIsLoginModalOpen(true)}
      >
        {isLoading ? "Loading..." : "Login"}
      </button>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default LoginButton;
