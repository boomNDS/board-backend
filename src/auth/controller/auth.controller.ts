import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthDto } from '../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: AuthDto) {
    return this.authService.login(payload);
  }

  @Post('register')
  async register(@Body() payload: AuthDto) {
    return this.authService.register(payload);
  }
}
