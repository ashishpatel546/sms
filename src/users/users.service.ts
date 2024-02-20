// user.service.ts

import { Injectable, BadRequestException,  InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository,Logger } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { genSalt, compare, hash } from 'bcryptjs';
import { error } from 'console';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
 // private logger = new Logger(UsersService.name);
  constructor(@InjectDataSource('USER') private readonly user: DataSource) {}

  private async hashPassword(password: string): Promise<string> {
    {
      try {
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        return hashedPassword;
      } catch (error) {
        //this.logger.error('Error hashing password');
       // this.logger.error(error.message);
        throw new InternalServerErrorException(
          'Something went wrong while saving user.',
        );
      }
    }
  }

  private confirmPassword(userPassword: string, confirmPwd: string): boolean{
    var ok = true;
    if(userPassword !== confirmPwd)
      ok = false;
    return ok;
  }
  
  private async verifyPassword(
    storedHashedPassword: string,
    plainPassword: string,
  ) {
    try {
      const result = await compare(plainPassword, storedHashedPassword);
      return result;
    } catch (error) {
      //this.logger.error('Error comparing passwords:');
      //this.logger.error(error.message);
      throw new InternalServerErrorException('Something went wrong!!!');
    }
  }

  async createUser(userDto: CreateUserDto): Promise<Partial<User>> {

    //Check if there is existing user
    const existingUser: User = await this.user
    .createQueryBuilder()
    .select()
    .from('user','u')
    .where("u.email= :email",{email:userDto?.email})
    .getRawOne();

    if(existingUser){
      throw new BadRequestException(`User already exists with email ${userDto.email}`);
    }

    //Confirm the password
    const cnfpwd = await this.confirmPassword(userDto?.password,userDto?.cnfpassword);
    if(cnfpwd){
      throw new error("Passwords do not match.");
    }

    const hashedPassword = await this.hashPassword(userDto.password);
    const newUser: Partial<User> = {
    
      email: userDto.email,
      first_name: userDto.first_name,
      last_name: userDto.last_name,
      mobile: userDto.mobile,
      role: userDto.role,
      password:hashedPassword,
    };
   // console.log(newUser.id);

    // Create a new user entity
  try{
    const dbRes = await this.user
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(newUser)
      .execute();

    //console.log(dbRes);
      
    // Save the new user entity to the database
    return {
      email: userDto.email,
      first_name: userDto.first_name,
      last_name: userDto.last_name,
      mobile: userDto.mobile,
      role: userDto.role,
     // password: userDto.password,
    };
  } catch(error) {
    throw new NotFoundException(error.message);
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
        //this.logger.log('user does not exist');
        throw new NotFoundException('user does not exist');
      }
      const { password: storedPassword, ...userDetails } = user;
      const isValidUser = await this.verifyPassword(storedPassword, password);
      return isValidUser ? [isValidUser, userDetails] : [false, null];
    } catch (error) {
      //this.logger.error(error.message);
      //this.logger.error('Unable to verify user');
      return [false, null];
    }
  }
}


