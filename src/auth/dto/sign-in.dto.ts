import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLE } from 'src/entities/user.entity';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  // @IsNotEmpty()
  // @IsString()
  // role:USER_ROLE;
}
