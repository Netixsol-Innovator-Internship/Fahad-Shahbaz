import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 128)
  password: string;
}

class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (!body || !body.username || !body.email || !body.password) {
      throw new BadRequestException(
        'username, email and password are required',
      );
    }
    return this.authService.register(body.username, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    // defensive: ensure body exists and has required fields before calling service
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('email and password are required');
    }
    const email = (body as any).email;
    const password = (body as any).password;
    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }
    return this.authService.login(email, password);
  }
}
