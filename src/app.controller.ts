import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/service/auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
