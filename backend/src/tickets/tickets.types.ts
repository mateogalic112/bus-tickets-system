import { Prisma, Ticket } from "@prisma/client";

export type RawUserTicket = Ticket & {
  Route: {
    startsAt: Date;
    name: string;
    endsAt: Date;
  } | null;
};

export type UserTicket = {
  id: number;
  price: Prisma.Decimal;
  name: string;
  startsAt: Date;
  endsAt: Date;
  isCancelled: boolean;
};
