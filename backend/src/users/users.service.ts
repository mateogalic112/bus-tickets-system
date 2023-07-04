import { PrismaClient } from "@prisma/client";
import HttpException from "../exceptions/HttpException";
import { RegisterUserDto } from "../auth/auth.validation";

class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  public createUser = async (registerData: RegisterUserDto) => {
    const createdUser = await this.prisma.user.create({
      data: {
        ...registerData,
      },
    });

    if (!createdUser) {
      throw new HttpException(500, "Error while creating user.");
    }

    return createdUser;
  };

  public getUserByEmail = async (email: string) => {
    const foundUser = await this.prisma.user.findFirst({ where: { email } });

    if (!foundUser) {
      throw new HttpException(404, "User not found.");
    }

    return foundUser;
  };

  public getUserById = async (id: number) => {
    const foundUser = await this.prisma.user.findFirst({ where: { id } });

    if (!foundUser) {
      throw new HttpException(404, "User not found.");
    }

    return foundUser;
  };
}

export default UsersService;
