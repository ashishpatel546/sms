import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Patch,
  Query,
  ParseBoolPipe,
  Param,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/guards/adminPermission.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { SuperAdminLimitGuard } from 'src/guards/superAdminLimit.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(SuperAdminLimitGuard)
  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.createUser(createUserDto);
      return { message: 'User created successfully', user: createdUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/activate-deactivate/:email/:is_active')
  activateOrDeactivateUser(
    @Param('email') email: string,
    @Param('is_active', ParseBoolPipe) is_active: boolean,
  ) {
    return this.usersService.activateOrDeactivateUser(email, is_active);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  changePassword(
    @Body() body: ChangePasswordDto,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.usersService.changePassword(
      user.email,
      body.oldPassword,
      body.newPassword,
    );
  }
  @Patch('forgot-password/:email')
  public async forgotPassword(@Param('email') email: string): Promise<string> {
    try {
      const isEmailSent = await this.usersService.sendEmailForgotPassword(
        email
      );
      if (isEmailSent) {
        return 'Email send sucessfully';
      } else {
        return 'Email not sent';
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @ApiBearerAuth('access-token')
  //@UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(
      body.email,
      body.otp,
      body.newPassword,
    );
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/user-info')
  getUserInfo(@CurrentUser() user: Partial<User>) {
    return { user: user ?? null };
  }
}
