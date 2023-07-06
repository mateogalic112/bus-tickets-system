import { useGetActiveRoutes } from "../api/routes/useGetActiveRoutes";
import RouteCard from "../components/cards/RouteCard";

const Home = () => {
  const {
    data: activeRoutes,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetActiveRoutes();

  const handleLoadMore = () => {
    if (isFetchingNextPage) return;
    fetchNextPage();
  };

  if (!activeRoutes) return null;

  return (
    <div className="p-8 flex flex-col gap-4">
      {activeRoutes.pages.map((page) =>
        page.items.map((route) => <RouteCard route={route} key={route.id} />)
      )}

      <div className="py-4">
        {hasNextPage ? (
          <button
            onClick={handleLoadMore}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Load more
          </button>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default Home;
