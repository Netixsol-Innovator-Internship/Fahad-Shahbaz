import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const userExists = await this.usersService.findByEmail(signupDto.email);
    if (userExists) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.usersService.create({
      ...signupDto,
      password: hashedPassword,
    });

    return { message: 'User created successfully', user };
  }

  async login(loginDto: LoginDto) {
    const user = (await this.usersService.findByEmail(
      loginDto.email,
    )) as UserDocument;

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    // convert to plain object safely
    const userObj = user.toObject?.() ?? user;

    // remove password before returning
    delete userObj.password;

    return {
      token: token,
      user: userObj,
    };
  }
}
