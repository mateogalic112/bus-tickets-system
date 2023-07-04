import { Prisma, Transporter, Route } from "@prisma/client";

export type RawActiveRoute = Route & {
  tickets: {
    id: number;
  }[];
};

export type ActiveRoute = {
  id: number;
  basePrice: Prisma.Decimal;
  name: string;
  startsAt: Date;
  endsAt: Date;
  maxTickets: number;
  transporter: Transporter;
  ticketCount: number;
};
