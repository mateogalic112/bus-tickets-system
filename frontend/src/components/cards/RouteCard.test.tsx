import { QueryClient, QueryClientProvider } from "react-query";
import { useGetCurrentUser } from "../../api/users/useGetCurrentUser";
import { afterEach, beforeEach, describe, vi, Mock, it } from "vitest";
import { ReactNode } from "react";
import { screen, render } from "@testing-library/react";
import RouteCard from "./RouteCard";
import { ActiveRoute, Transporter } from "../../types/routes";
import { addHours } from "date-fns";

const mockedUseGetCurrentUser = useGetCurrentUser as Mock;
vi.mock("../../api/users/useGetCurrentUser");

describe("Route card", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("NOT logged in user view", () => {
    beforeEach(() => {
      mockedUseGetCurrentUser.mockImplementation(() => ({
        isLoading: true,
        data: undefined,
      }));
    });

    it("Should display route informations", () => {
      render(<RouteCard route={mockedRoute} />, { wrapper });

      const title = screen.getByText(/split - rijeka/i);
      expect(title).toBeInTheDocument();
    });

    it("Buy button should be disabled", () => {
      render(<RouteCard route={mockedRoute} />, { wrapper });

      const buyButton = screen.getByRole("button", {
        name: /buy/i,
      });
      expect(buyButton).toBeDisabled();
    });
  });

  describe("Logged in user view", () => {
    beforeEach(() => {
      mockedUseGetCurrentUser.mockImplementation(() => ({
        isLoading: true,
        data: loggedInUser,
      }));
    });

    it("Buy button should be enabled", () => {
      render(<RouteCard route={mockedRoute} />, { wrapper });

      const buyButton = screen.getByRole("button", {
        name: /buy/i,
      });
      expect(buyButton).toBeEnabled();
    });
  });
});

const mockedRoute: ActiveRoute = {
  id: 1,
  basePrice: "99.99",
  name: "Split - Rijeka",
  startsAt: addHours(new Date(), 2),
  endsAt: addHours(new Date(), 6),
  maxTickets: 10,
  transporter: Transporter.COAST_TOUR,
  ticketCount: 0,
};

const loggedInUser = {
  id: 1,
  email: "user1@gmail.com",
  password: "$2b$10$LxodYRxbSXjJqrH/19rEsOdFOO9pAWSBt8.yDnhKoRu0h5WU3ymmy",
  firstName: "User1",
  lastName: "Jr.",
  createdAt: "2023-07-06T14:41:41.815Z",
  updatedAt: "2023-07-06T14:41:41.815Z",
};
