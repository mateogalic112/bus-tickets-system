import { Route } from "@prisma/client";

export interface RouteWithTicketCount extends Route {
  ticketCount: number;
}
