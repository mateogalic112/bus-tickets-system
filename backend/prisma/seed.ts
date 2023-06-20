import { addHours } from "date-fns";

import { Prisma, PrismaClient, Transporter } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.route.deleteMany();

  const createdRoutes = createRoutes();

  await prisma.route.createMany({ data: createdRoutes });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

function createRoutes() {
  const cities = ["Split", "Zagreb", "Rijeka", "Pula"];
  const createdRoutes = [...Array(10).keys()].map((key) => ({
    name: `${cities[key % (cities.length - 1)]} - ${
      cities[(key + 1) % (cities.length - 1)]
    }`,
    startsAt: new Date(addHours(new Date(), key + 1)),
    endsAt: new Date(addHours(new Date(), key + 2)),
    basePrice: new Prisma.Decimal(99.99 + key * 10),
    maxTickets: key + 5,
    transporter: Transporter.SEA_TRANS,
  }));
  return createdRoutes;
}
