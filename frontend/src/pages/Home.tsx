import { useGetActiveRoutes } from "../api/routes/useGetActiveRoutes";
import { format } from "date-fns";

const Home = () => {
  const { data } = useGetActiveRoutes();
  console.log({ data });

  if (!data) return null;

  return (
    <ul className="p-8 flex flex-col gap-4">
      {data.pages.map((page) =>
        page.items.map((item) => (
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="p-8 px-5">
              <h6 className="text-gray-500 pb-2">{item.transporter}</h6>
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {item.name}
              </h5>
              <div className="flex gap-2 mt-2.5 mb-2 text-gray-600 dark:text-gray-400">
                <p>{format(new Date(item.startsAt), "dd MMMM yyyy")}</p>
                <p>
                  {format(new Date(item.startsAt), "HH:mm")} -{" "}
                  {format(new Date(item.endsAt), "HH:mm")}
                </p>
              </div>
              <p className="text-gray-300 mb-2">
                {item.maxTickets - item.ticketCount} tickets left
              </p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${item.basePrice}
                </span>
                {
                  <button
                    disabled={item.maxTickets - item.ticketCount === 0}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50  disabled:bg-blue-700 "
                  >
                    Buy
                  </button>
                }
              </div>
            </div>
          </div>
        ))
      )}
    </ul>
  );
};

export default Home;
