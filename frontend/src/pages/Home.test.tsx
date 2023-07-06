import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";
import { useGetActiveRoutes } from "../api/routes/useGetActiveRoutes";
import { addHours } from "date-fns";
import { Transporter } from "../types/routes";

const mockedUseGetActiveRoutes = useGetActiveRoutes as jest.Mock;
jest.mock("../api/routes/useGetActiveRoutes");

describe("User NOT logged in homepage display", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    mockedUseGetActiveRoutes.mockImplementation(() => ({
      isLoading: true,
      data: undefined,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Guest user should see all tickets displayed", async () => {
    mockedUseGetActiveRoutes.mockImplementation(() => ({
      isLoading: false,
      data: { pages: [{ items: mockedActiveRoutes }] },
    }));

    render(<Home />, { wrapper });

    const firstItemTitle = screen.getByText(/split - rijeka/i);
    const secondItemTitle = screen.getByText(/split - zagreb/i);

    expect(firstItemTitle).toBeInTheDocument();
    expect(secondItemTitle).toBeInTheDocument();

    const buyButton = screen.getAllByRole("button", {
      name: /buy/i,
    })[0];
    expect(buyButton).toBeDisabled();
  });
});

const mockedActiveRoutes = [
  {
    id: 1,
    basePrice: "99.99",
    name: "Split - Rijeka",
    startsAt: addHours(new Date(), 2),
    endsAt: addHours(new Date(), 6),
    maxTickets: 10,
    transporter: Transporter.COAST_TOUR,
    ticketCount: 0,
  },
  {
    id: 2,
    basePrice: "199.99",
    name: "Split - Zagreb",
    startsAt: addHours(new Date(), 2),
    endsAt: addHours(new Date(), 6),
    maxTickets: 10,
    transporter: Transporter.COAST_TOUR,
    ticketCount: 0,
  },
];
