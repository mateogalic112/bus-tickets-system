import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Navigation from "./Navigation";
import { render, screen } from "@testing-library/react";
import { useGetCurrentUser } from "../api/users/useGetCurrentUser";
import "@testing-library/jest-dom";

const mockedUseGetCurrentUser = useGetCurrentUser as jest.Mock;
jest.mock("../api/users/useGetCurrentUser");

describe("Navigation component", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    mockedUseGetCurrentUser.mockImplementation(() => ({
      isLoading: true,
      data: undefined,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should display user email if user is logged in", async () => {
    mockedUseGetCurrentUser.mockImplementation(() => ({
      isLoading: false,
      data: loggedInUser,
    }));

    render(<Navigation />, { wrapper });

    const email = screen.getByText(loggedInUser.email);
    expect(email).toBeInTheDocument();

    const myTicketsButton = screen.getByRole("button", {
      name: /my tickets/i,
    });
    expect(myTicketsButton).toBeInTheDocument();
  });

  test("Should display login button if user is NOT logged in", async () => {
    mockedUseGetCurrentUser.mockImplementation(() => ({
      isLoading: false,
      data: undefined,
    }));

    render(<Navigation />, { wrapper });

    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });
    expect(loginButton).toBeInTheDocument();
  });
});

const loggedInUser = {
  id: 1,
  email: "user1@gmail.com",
  password: "$2b$10$LxodYRxbSXjJqrH/19rEsOdFOO9pAWSBt8.yDnhKoRu0h5WU3ymmy",
  firstName: "User1",
  lastName: "Jr.",
  createdAt: "2023-07-06T14:41:41.815Z",
  updatedAt: "2023-07-06T14:41:41.815Z",
};
