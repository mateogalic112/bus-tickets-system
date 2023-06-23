import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gray-900">
        <Navigation />
        <Home />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
