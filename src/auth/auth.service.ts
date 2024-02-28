
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const [isValidUser, user] = await this.userService.validateUser(
      email,
      password
    );
    if (isValidUser) {
      return user;
    }
    return null;
  }

  async login(userDto: SignInDto) {
    const user = await this.validateUser(userDto.email, userDto.password);
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      is_active: user.is_active,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
