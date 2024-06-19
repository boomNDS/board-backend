import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import * as bcrypt from 'bcrypt';
import { IUser } from '../../user/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(payload: IUser) {
    const user = await this.userService.findOne(payload.username);
    if (user && (await bcrypt.compare(payload.password, user.password))) {
      const { password, ...result } = user;
      const token = this.jwtService.sign({
        username: user.username,
        sub: user.id,
      });
      return { access_token: token };
    }
    return null;
  }

  async register(userData: IUser) {
    const user = await this.userService.create(userData);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
