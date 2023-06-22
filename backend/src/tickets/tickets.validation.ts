import { z } from "zod";

export const buyTicketSchema = z.object({
  body: z.object({
    price: z.number({
      required_error: "Price is required",
    }),
    routeId: z.number({
      required_error: "Route is required",
    }),
  }),
});

export type BuyTicketDto = z.infer<typeof buyTicketSchema>["body"];
