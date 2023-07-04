import { ActiveRoute, RawActiveRoute } from "./routes.types";

export const parseActiveRoute = (
  rawActiveRoute: RawActiveRoute
): ActiveRoute => ({
  id: rawActiveRoute.id,
  basePrice: rawActiveRoute.basePrice,
  name: rawActiveRoute.name,
  startsAt: rawActiveRoute.startsAt,
  endsAt: rawActiveRoute.endsAt,
  maxTickets: rawActiveRoute.maxTickets,
  transporter: rawActiveRoute.transporter,
  ticketCount: rawActiveRoute.tickets.length,
});
