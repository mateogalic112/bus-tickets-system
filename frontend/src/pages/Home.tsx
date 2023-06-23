import { useGetActiveRoutes } from "../api/routes/useGetActiveRoutes";

const Home = () => {
  const { data } = useGetActiveRoutes();
  console.log({ data });

  return <div>Home</div>;
};

export default Home;
