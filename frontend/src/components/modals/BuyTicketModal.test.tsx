import { QueryClient, QueryClientProvider } from "react-query";
import { useGetCurrentUser } from "../../api/users/useGetCurrentUser";
import { afterEach, beforeEach, describe, vi, Mock, it } from "vitest";
import { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BuyTicketModal from "./BuyTicketModal";
import { addHours } from "date-fns";
import { ActiveRoute, Transporter } from "../../types/routes";
import userEvent from "@testing-library/user-event";

const mockedUseGetCurrentUser = useGetCurrentUser as Mock;
vi.mock("../../api/users/useGetCurrentUser");

const mockBuyTicket = vi.fn().mockResolvedValue({ data: "mocked response" });

// this mock can be improved depending on the consumer component
vi.mock("../../api/tickets/useBuyTicket", () => ({
  useBuyTicket: () => ({
    mutateAsync: mockBuyTicket,
  }),
}));

describe("Buy Ticket modal", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    mockedUseGetCurrentUser.mockImplementation(() => ({
      isLoading: true,
      data: loggedInUser,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should call purchase handler on ticket purchase", async () => {
    const user = userEvent.setup();

    render(<BuyTicketModal isOpen onClose={() => null} route={mockedRoute} />, {
      wrapper,
    });

    const creditCardField = screen.getByLabelText(/your credit card/i);
    const creditCardData = "123";
    await user.type(creditCardField, creditCardData);

    const submitButton = screen.getByText(/submit/i);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockBuyTicket).toHaveBeenCalledWith({
        price: +mockedRoute.basePrice,
        routeId: mockedRoute.id,
        creditCard: creditCardData,
      });
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
