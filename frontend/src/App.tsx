import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gray-900 flex justify-center min-h-screen">
        <div className="w-full max-w-screen-xl">
          <Navigation />
          <Home />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
