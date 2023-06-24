import { useGetCurrentUser } from "../api/users/useGetCurrentUser";
import UserTicketsButton from "./buttons/UserTicketsButton";
import LoginButton from "./buttons/LoginButton";

const Navigation = () => {
  const { data: user } = useGetCurrentUser();

  return (
    <>
      <nav className="flex items-center gap-8  py-3 px-8 w-full">
        <h1 className="text-2xl grow font-bold leading-none tracking-tight text-gray-900  dark:text-white">
          Bus ticket system
        </h1>
        <div className="flex items-center grow">
          <div className="flex text-sm">{user && <UserTicketsButton />}</div>
          <div className="ml-auto">
            {user && (
              <div className="flex gap-2">
                <p className="text-white">{user.email}</p>
              </div>
            )}
            {!user && <LoginButton />}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
