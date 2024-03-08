import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SuperAdminLimitGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user=request.body;
    if (user?.role === 'SUPER_ADMIN') {
      const superAdminsCount = await this.userService.countSuperAdmins();
      const maxSuperAdmins = 2;

      if (superAdminsCount < maxSuperAdmins) {
        return true;
      } 
      else {
        return false;
     
      }
    } 
    else {
      return true;
    }

   
  }
}
