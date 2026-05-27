/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerService } from './service';

class RegisterController {
  async register(body: any) {
    const user = await registerService.createUser(body);

    return {
      message: 'Регистрация прошла успешно',
      user,
    };
  }
}

export const registerController = new RegisterController();
