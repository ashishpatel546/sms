import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('user');
    try {
      const createdUser = await this.usersService.createUser(createUserDto);
      return { message: 'User created successfully', user: createdUser };
    } catch (error) {
      throw new BadRequestException('Failed to register user');
    }
  }
}
