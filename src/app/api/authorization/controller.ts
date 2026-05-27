import { authService } from './service';

/* eslint-disable @typescript-eslint/no-explicit-any */
class AuthController {
  async auth(body: any) {
    const user = await authService.authUser(body);

    return {
      message: 'авторизация прошла успешно',
      user,
    };
  }
}

export const authController = new AuthController();
