import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { USER_ROLE, User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  // private logger = new Logger(AdminGuard.name);
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqObj: Request = context.switchToHttp().getRequest();
    const user: Partial<User> = reqObj.user;

    const currentUserData = await this.userService.findUserByEmail(user.email);
    const currentUser = currentUserData;

    if (currentUser?.is_active && currentUser.role === USER_ROLE.superadmin) {
      return true;
    }

    if (currentUser?.is_active && currentUser.role === USER_ROLE.admin) {
      return true;
    } else {
      return false;
    }
  }
}
