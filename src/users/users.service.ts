// user.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import redis from 'redis';
import { createClient } from 'redis';

import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { genSalt, compare, hash } from 'bcryptjs';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';
import { default as config } from 'src/config/config';

const nodemailer = require('nodemailer');
const client = createClient({
  password: 'sLTUz5INwHJTCEDWyfetL5gSfxKCxQoH',
  socket: {
    host: 'redis-12697.c330.asia-south1-1.gce.cloud.redislabs.com',
    port: 12697,
  },
});
// client.connect();

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
      // this.logger.log(`user info modified by user. Email: ${email}`);
    } catch (error) {
      // this.logger.error(error.message);
      //this.logger.error('unable to update user info');
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

  async sendEmailForgotPassword(email: string): Promise<boolean> {
    var userFromDb = await this.findUserByEmail(email);
    if (!userFromDb)
      throw new HttpException(
        'User does not exist with email',
        HttpStatus.NOT_FOUND,
      );
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await client.connect();
    await client.set(email, otp, { EX: 900 });

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure, // true for 465, false for other ports
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
    let mailOptions = {
      from: {
        name: 'ABC school',
        address: config.mail.user,
      },
      to: email,
      subject: 'Frogotten Password',
      text: 'Forgot Password',
      html:
        'Hi! <br><br> If you requested to reset your password<br><br>  Your OTP is ' +
        otp +
        '<br><br>' +
        '<a href=' +
        config.host.url +
        ':' +
        config.host.port +
        '/users/email/reset-password/>Click here</a>',
    };

    // var sent = await new Promise<boolean>(async function (resolve, reject) {
    //   return await transporter.sendMail(mailOptions, async (error, info) => {
    //     if (error) {
    //       console.log('Message sent: %s', error);
    //       return reject(false);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    //     resolve(true);
    //   });
    // });
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      await client.disconnect();
      return true;
    } catch (error) {
      await client.disconnect();
      console.error('Error sending email:', error);
      return false;
    }

    // return info;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    try {
      await client.connect();
      const storedOTP = await client.get(email);
      if (storedOTP === otp) {
        await client.del(email);
        await client.disconnect();
        return true;
      } else {
        await client.disconnect();
        return false;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<string> {
    try {
      const isOTPValid = await this.verifyOTP(email, otp);
      if (isOTPValid) {
        const hashedPassword = await this.hashPassword(newPassword);
        await this.user
          .createQueryBuilder()
          .update('user')
          .set({
            password: hashedPassword,
          })
          .where('email= :email', { email: email })
          .execute();
          
        return 'Password changed successfully';
      } else {
        return 'OTP invalid';
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async countSuperAdmins(): Promise<number> {
    try {
      const result = await this.user
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'SUPER_ADMIN' })
        .getCount();

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
