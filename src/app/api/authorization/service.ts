/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/shared/utils/db';

class AuthService {
  async authUser(body: any) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
      include: {
        basket: {
          include: { items: true },
        },
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        basket: {
          create: {},
        },
      },
      include: {
        basket: {
          include: { items: true },
        },
      },
    });
    return newUser;
  }
}

export const authService = new AuthService();
