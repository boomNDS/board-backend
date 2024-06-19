import { Controller, Request, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() userData) {
    return this.authService.login(userData);
  }

  @Post('register')
  async register(@Body() userData) {
    return this.authService.register(userData);
  }
}
