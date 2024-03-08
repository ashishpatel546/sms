import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { USER_ROLE, User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  private logger = new Logger(SuperAdminGuard.name);
  constructor(private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqObj: Request = context.switchToHttp().getRequest();
    const user: Partial<User> = reqObj.user;

    const currentUserData = await this.userService.findUserByEmail(user.email);
    const currentUser = currentUserData;
    if (currentUser?.is_active && currentUser.role === USER_ROLE.superadmin) {
      this.logger.log(`Requested by ADMIN: ${user.email}`);
      return true;
    } else {
      return false;
    }
  }
}
