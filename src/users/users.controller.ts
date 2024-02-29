import { Body, Controller, Post, BadRequestException, UseGuards, Patch, Query, ParseBoolPipe, Param, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/guards/adminPermission.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './entity/user.entity';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true}))
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
    //console.log('body.oldPassword', body.oldPassword)
    return this.usersService.changePassword(
      user.email,
      body.oldPassword,
      body.newPassword,
    );
  }
  @Get('email/forgot-password/:email')
  public async sendEmailForgotPassword(@Param() params): Promise<string> {
    try {
      var isEmailSent = await this.usersService.sendEmailForgotPassword(params.email);
      if(isEmailSent){
        return "LOGIN.EMAIL_RESENT";
      } else {
        return "REGISTRATION.ERROR.MAIL_NOT_SENT";
      }
    } catch(error) {
      return "LOGIN.ERROR.SEND_EMAIL";
    }
  }



}
