import { Route, Ticket } from "@prisma/client";
import { RawUserTicket, UserTicket } from "./tickets.types";

export const parseUserTicket = (rawUserTicket: RawUserTicket): UserTicket => ({
  id: rawUserTicket.id,
  price: rawUserTicket.price,
  name: rawUserTicket.Route!.name,
  startsAt: rawUserTicket.Route!.startsAt,
  endsAt: rawUserTicket.Route!.endsAt,
  isCancelled: rawUserTicket.isCanceled,
});

export const constructUserTicketFrom = (
  createdTicket: Ticket,
  ticketRoute: Route
) => ({
  id: createdTicket.id,
  price: createdTicket.price,
  name: ticketRoute!.name,
  startsAt: ticketRoute!.startsAt,
  endsAt: ticketRoute!.endsAt,
  isCancelled: createdTicket.isCanceled,
});
