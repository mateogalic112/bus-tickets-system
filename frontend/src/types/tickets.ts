export type UserTicket = {
  id: number;
  price: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
  isCancelled: boolean;
};
