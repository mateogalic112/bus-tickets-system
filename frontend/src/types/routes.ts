export enum Transporter {
  COAST_TOUR,
  SEA_TRANS,
}

export type ActiveRoute = {
  id: number;
  basePrice: number;
  name: string;
  startsAt: Date;
  endsAt: Date;
  maxTickets: number;
  transporter: Transporter;
  ticketCount: number;
};
