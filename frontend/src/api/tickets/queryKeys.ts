export const TICKETS_QUERY_KEYS = {
  TICKETS: "tickets",
  ME: "me",
  CANCEL: "cancel",
};

export const ticketKeys = {
  tickets: [TICKETS_QUERY_KEYS.TICKETS] as const,
  userTickets: () => [...ticketKeys.tickets, TICKETS_QUERY_KEYS.ME] as const,
};
