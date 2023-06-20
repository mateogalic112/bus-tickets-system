import { addHours } from "date-fns";

import { Prisma, PrismaClient, Transporter } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.route.deleteMany();

  const splitZagreb = await prisma.route.create({
    data: {
      name: "Split - Zagreb",
      startsAt: new Date(addHours(new Date(), 1)),
      endsAt: new Date(addHours(new Date(), 2)),
      basePrice: new Prisma.Decimal(99.99),
      maxTickets: 5,
      transporter: Transporter.SEA_TRANS,
    },
  });

  const splitRijeka = await prisma.route.create({
    data: {
      name: "Split - Rijeka",
      startsAt: new Date(addHours(new Date(), 2)),
      endsAt: new Date(addHours(new Date(), 2)),
      basePrice: new Prisma.Decimal(99.99),
      maxTickets: 5,
      transporter: Transporter.SEA_TRANS,
    },
  });

  console.log({ splitZagreb, splitRijeka });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
