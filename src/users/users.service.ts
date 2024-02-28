// user.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { genSalt, compare, hash } from 'bcryptjs';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(@InjectDataSource('USER') private readonly user: DataSource) {}

  async findUserByEmail(email: string): Promise<Partial<User>> {
    try {
      const user: Partial<User> = await this.user
        .createQueryBuilder()
        .select()
        .from('user', 'u')
        .where('u.email= :email', { email: email })
        .getRawOne();

      if (!user) {
        throw new NotFoundException('user does not exist');
      }

      return {
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      };
    } catch (error) {
      return error.message;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    {
      try {
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        return hashedPassword;
      } catch (error) {
        throw new InternalServerErrorException(
          'Something went wrong while saving user.',
        );
      }
    }
  }

  private confirmPassword(userPassword: string, confirmPwd: string): boolean {
    return userPassword !== confirmPwd ? false : true;
  }

  private async verifyPassword(
    storedHashedPassword: string,
    plainPassword: string,
  ) {
    try {
      const result = await compare(plainPassword, storedHashedPassword);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!!!');
    }
  }

  async createUser(userDto: CreateUserDto): Promise<Partial<User>> {
    //Check if there is existing user
    const existingUser: User = await this.user
      .createQueryBuilder()
      .select()
      .from('user', 'u')
      .where('u.email= :email', { email: userDto?.email })
      .getRawOne();

    if (existingUser) {
      throw new BadRequestException(
        `User already exists with email ${userDto.email}`,
      );
    }
    //Confirm the password
    const cnfpwd = await this.confirmPassword(
      userDto?.password,
      userDto?.cnfpassword,
    );

    if (!cnfpwd) {
      throw new error('Passwords do not match.');
    }
    const hashedPassword = await this.hashPassword(userDto.password);
    const newUser: Partial<User> = {
      email: userDto.email,
      first_name: userDto.first_name,
      last_name: userDto.last_name,
      mobile: userDto.mobile,
      role: userDto.role,
      password: hashedPassword,
    };
    // Create a new user entity
    try {
      const dbRes = await this.user
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(newUser)
        .execute();

      // Save the new user entity to the database
      return {
        email: userDto.email,
        first_name: userDto.first_name,
        last_name: userDto.last_name,
        mobile: userDto.mobile,
        role: userDto.role,
        // password: userDto.password,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async activateOrDeactivateUser(
    email: string,
    is_activate: boolean,
  ): Promise<unknown> {
    const checkExistingUser = await this.findUserByEmail(email);
    if (!checkExistingUser) {
      throw new BadRequestException(`user doesn't exist with email: ${email}`);
    }
    try {
      const updateResult: UpdateResult = await this.user
        .createQueryBuilder()
        .update('user')
        .set({ is_active: is_activate })
        .where('email = :email', { email: email })
        .execute();

      // Check if the update was successful
      if (updateResult.affected === 0) {
        throw new InternalServerErrorException('Failed to update user');
      }
      const user = await this.findUserByEmail(email);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<[boolean, Partial<User>]> {
    try {
      const user: User = await this.user
        .createQueryBuilder()
        .select()
        .from('user', 'u')
        .where('u.email= :email', { email: email })
        .getRawOne();
      if (!user) {
        throw new NotFoundException('user does not exist');
      }
      const { password: storedPassword, ...userDetails } = user;
      const isValidUser = await this.verifyPassword(storedPassword, password);
      return isValidUser ? [isValidUser, userDetails] : [false, null];
    } catch (error) {
      return [false, null];
    }
  }
}
