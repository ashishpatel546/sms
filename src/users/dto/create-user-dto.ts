            
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  IsStrongPassword,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { USER_ROLE } from 'src/users/entity/user.entity';

@ValidatorConstraint({ name: 'isEmailInDomain', async: false })
class IsEmailInDomainConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    const domain = 'abc.in'; // Domain of blinkcharging
    const emailParts = email.split('@');
   
    return emailParts.length === 2 && emailParts[1] === domain;
  }
}

export function IsEmailInDomain(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    //console.log(object)
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailInDomainConstraint,
    });
  };
}

export class CreateUserDto {
  @IsEmailInDomain({ message: 'Email must be blink email' })
  @IsEmail(
    { domain_specific_validation: true },
    { message: 'Must have valid email' },
  )
  
  email: string;

  
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

 @IsOptional()
  @IsMobilePhone()
  mobile: string;

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
  password: string;

  @IsString()
  cnfpassword:string;

  
  @IsEnum(USER_ROLE, {
    message: `Must have role TECH_ROLE | ADMIN |SUPER_ADMIN`,
  })
  role: USER_ROLE;
}
