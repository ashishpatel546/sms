// user.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectDataSource('USER') private readonly user: DataSource,
      ) {}
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    
    // Check if user already exists with the provided email
    // const existingUser = await this.user.createQueryBuilder()
    // .select()
    // .from(User,'users')
    // .where("users.email=:email",{email: userDto.email}).getRawOne();

    // if (existingUser) {
    //   throw new BadRequestException('User already exists');
    // }

    // Create a new user entity
    const dbRes = await this.user.createQueryBuilder()
    .insert()
    .into(User)
    .values([{
        
        email:userDto.email,
        password:userDto.password,
    }])
    .execute();
    
    console.log(dbRes)
    // Save the new user entity to the database
    return {
        id: 1,
        email:userDto.email,
        password:userDto.password,
        
    }

// createUser(createUserDto: CreateUserDto): Promise<User> {
//     const user: User = new User();
   
//     user.email = createUserDto.email;
  
//     user.password = createUserDto.password;
  
//     return this.userRepository.save(user);
  }
  }

