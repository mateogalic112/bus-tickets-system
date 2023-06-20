import { PrismaClient } from "@prisma/client";

class PrismaService {
  public static prisma: PrismaClient;

  private constructor() {}

  public static getPrisma(): PrismaClient {
    if (!PrismaService.prisma) {
      PrismaService.prisma = new PrismaClient();
    }

    return PrismaService.prisma;
  }
}

export default PrismaService;
