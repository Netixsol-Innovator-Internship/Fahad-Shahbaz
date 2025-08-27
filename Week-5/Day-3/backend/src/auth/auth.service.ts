import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const user = await this.usersService.create(username, email, password);
    const payload = { sub: user._id, username: user.username };
    const safe = {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    };
    return { token: this.jwtService.sign(payload), user: safe };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.validatePassword(email, password);
    if (!user) throw new UnauthorizedException('invalid credentials');
    const payload = { sub: user._id, username: user.username };
    const safe = {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    };
    return { token: this.jwtService.sign(payload), user: safe };
  }
}
