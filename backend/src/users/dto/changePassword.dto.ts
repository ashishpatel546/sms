import { IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsStrongPassword(
    {
      minLength: 6,
      minUppercase: 1,
      minSymbols: 1,
      minLowercase: 1,
      minNumbers: 1,
    },
    {
      message:
        'Password must have 6 character long and must contain 1 Uppercase, 1 Lowercase, 1 symbol and 1 numeric value',
    },
  )
  newPassword: string;
}
