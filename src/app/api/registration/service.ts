/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/shared/utils/db';

class RegisterService {
  async createUser(body: any) {
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        city: '',
        street: '',
        home: '',
        apartment: '',
        numbering: '',
        basket: {
          create: {},
        },
      },
    });

    return newUser;
  }
}

export const registerService = new RegisterService();
