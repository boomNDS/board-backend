import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Request() req) {
    return { message: 'This is a protected route', user: req.user };
  }
}
