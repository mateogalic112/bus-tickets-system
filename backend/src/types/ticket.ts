import { Prisma } from "@prisma/client";

export type UserTicket = {
  id: number;
  price: Prisma.Decimal;
  name: string;
  startsAt: Date;
  endsAt: Date;
};
