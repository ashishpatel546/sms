import { Controller, Req } from '@nestjs/common';
import { Body,Post,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { LocalAuthGuard } from './local-auth.gaurd';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.gaurd';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() body: SignInDto) {
    return this.authService.login(body);
  }

  // @Post('logout')
  // logout(@Req() req: Request): void {
  //   const token = req.headers['authorization'].split(' ')[1]; // Extract token from headers
  //   this.authService.blacklistToken(token);
  //   console.log('logout successfully')
  //   // Optionally, you can send a response indicating successful logout
  // }
 
}