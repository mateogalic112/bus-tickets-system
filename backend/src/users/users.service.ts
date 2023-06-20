import { PrismaClient } from "@prisma/client";
import HttpException from "../exceptions/HttpException";

class UsersService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public getUserByEmail = async (email: string) => {
    const foundUser = await this.prisma.user.findFirst({ where: { email } });
    if (!foundUser) {
      throw new HttpException(404, "User not found.");
    }
    return foundUser;
  };
}

export default UsersService;
