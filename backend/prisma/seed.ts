import { addHours } from "date-fns";

import { Prisma, PrismaClient, Transporter } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.route.deleteMany();
  await prisma.user.deleteMany();

  const createdRoutes = createRoutes();
  const createdUsers = createUsers();

  await prisma.route.createMany({ data: createdRoutes });
  await prisma.user.createMany({ data: createdUsers });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

function createUsers() {
  const createdUsers = [...Array(3).keys()].map((key) => ({
    email: `user${key + 1}@gmail.com`,
    password: "123",
    firstName: `User${key + 1}`,
    lastName: `Jr.`,
  }));
  return createdUsers;
}

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
