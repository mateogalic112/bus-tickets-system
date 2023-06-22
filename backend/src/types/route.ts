import { Prisma, Transporter } from "@prisma/client";

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
