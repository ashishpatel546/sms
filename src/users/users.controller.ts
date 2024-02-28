import { Body, Controller, Post, BadRequestException, UseGuards, Patch, Query, ParseBoolPipe, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/guards/adminPermission.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
}
