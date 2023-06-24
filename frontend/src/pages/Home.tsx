import { useGetActiveRoutes } from "../api/routes/useGetActiveRoutes";
import RouteCard from "../components/RouteCard";

const Home = () => {
  const { data: activeRoutes } = useGetActiveRoutes();

  if (!activeRoutes) return null;
  return (
    <ul className="p-8 flex flex-col gap-4">
      {activeRoutes.pages.map((page) =>
        page.items.map((route) => <RouteCard route={route} key={route.id} />)
      )}
    </ul>
  );
};

export default Home;
