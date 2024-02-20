import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';



@Module({
  imports: [TypeOrmModule.forFeature([User], 'USER')],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
