import { useState } from "react";
import { useGetCurrentUser } from "../api/users/useGetCurrentUser";
import LoginModal from "./LoginModal";

const Navigation = () => {
  const { data: user } = useGetCurrentUser();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center gap-8  py-3 px-8 w-full">
        <h1 className="text-2xl grow font-bold leading-none tracking-tight text-gray-900  dark:text-white">
          Bus ticket system
        </h1>
        <div className="flex items-center grow">
          <div className="flex text-sm">
            <a
              href="#responsive-header"
              className="block lg:inline-block lg:mt-0  text-white mr-4"
            >
              Docs
            </a>
            <a
              href="#responsive-header"
              className="block lg:inline-block lg:mt-0  text-white mr-4"
            >
              Examples
            </a>
            <a
              href="#responsive-header"
              className="block lg:inline-block lg:mt-0  text-white"
            >
              Blog
            </a>
          </div>
          <div className="ml-auto">
            {user && (
              <div className="flex gap-2">
                <p className="text-white">{user.email}</p>
              </div>
            )}
            {!user && (
              <button
                data-modal-target="authentication-modal"
                data-modal-toggle="authentication-modal"
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
