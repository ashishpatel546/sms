// user.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { genSalt, compare, hash } from 'bcryptjs';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';
import {default as config} from 'src/config/config';

const nodemailer = require("nodemailer")

@Injectable()
export class UsersService {
  constructor(
   

    @InjectDataSource('USER') private readonly user: DataSource,
  ) {}

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
      throw new InternalServerErrorException(error.message);
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

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<string> {
    try {
      const user = await this.user
        .createQueryBuilder()
        .select()
        .from('user', 'u')
        .where('u.email= :email', { email: email })
        .getRawOne();
      if (!user) {
        //  this.logger.log('user not found');
        throw new NotFoundException('user not found with given email');
      }
      const isVerified = await this.verifyPassword(user?.password, oldPassword);
      console.log('hi2');
      if (!isVerified) {
        //console.log('hi2')
        throw new BadRequestException('Password does not matched');
      }
      const hashedPassword = await this.hashPassword(newPassword);

      await this.user
        .createQueryBuilder()
        .update('user')
        .set({
          password: hashedPassword,
        })
        .where('email= :email', { email: email })
        .execute();
      console.log('hi3');
      // this.logger.log(`user info modified by user. Email: ${email}`);
    } catch (error) {
      // this.logger.error(error.message);
      //this.logger.error('unable to update user info');
      console.log('error ane vali h');
      throw new BadRequestException(error.message);
    }
    return 'Password Changed Successfully';
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
   createForgottenPasswordToken(email: string) {
    // var forgottenPassword= await this.findUserByEmail(email);
    // if (forgottenPassword && ( (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 < 15 )){
    //   throw new HttpException('RESET_PASSWORD.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    // } else {
    //   var forgottenPasswordModel = await this.forgottenPasswordModel.findOneAndUpdate(
    //     {email: email},
        // { 
        //   email: email,
          return (Math.floor(Math.random() * (9000000)) + 1000000).toString(); //Generate 7 digits number,
          // timestamp: new Date()
      //   },
      //   {upsert: true, new: true}
      // // );
      // if(forgottenPasswordModel){
      //   return forgottenPasswordModel;
      // } else {
      //   throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
      // }
   // }
  }


  async sendEmailForgotPassword(email: string): Promise<boolean> {
    var userFromDb = await this.findUserByEmail(email);
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    var tokenModel = await this.createForgottenPasswordToken(email);

    if(tokenModel){
        let transporter = nodemailer.createTransport({
         service: 'gmail',
          host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.secure, // true for 465, false for other ports
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });
    
        let mailOptions = {
          from: {
            name: 'ABC school',
            address: config.mail.user
          }, 
          to: email, // list of receivers (separated by ,)
          subject: 'Frogotten Password', 
          text: 'Forgot Password',
          html: 'Hi! <br><br> If you requested to reset your password<br><br>'+
          '<a href='+ config.host.url + ':' + config.host.port +'/users/email/reset-password/'+ tokenModel + '>Click here</a>'  // html body
        };
    
        var sent = await new Promise<boolean>(async function(resolve, reject) {
          return await transporter.sendMail(mailOptions, async (error, info) => {
              if (error) {      
                console.log('Message sent: %s', error);
                return reject(false);
              }
              console.log('Message sent: %s', info.messageId);
              resolve(true);
          });      
        })

        return sent;
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }
}
