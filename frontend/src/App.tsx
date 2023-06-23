import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-[##e4e4e7]">
        <Home />
        <h1 className="text-2xl font-bold underline">Hello world!</h1>
      </div>
    </QueryClientProvider>
  );
}

export default App;
