import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { USER_ROLE } from 'src/entities/user.entity';

@ValidatorConstraint({ name: 'isEmailInDomain', async: false })
class IsEmailInDomainConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    const domain = 'gmail.com'; // Domain of blinkcharging
    const emailParts = email.split('@');

    return emailParts.length === 2 && emailParts[1] === domain;
  }
}

export function IsEmailInDomain(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    //console.log(object)
    registerDecorator({
      name: 'isEmailInDomain',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailInDomainConstraint,
    });
  };
}

export class NewTeacherDto {
  //Personal Information
  @IsEmail()
  @IsEmailInDomain({ message: 'Email must be a school email' })
  email: string;
  
   @IsString()
   password: string;

  @IsString()
  first_name: string;
  
  @IsString()
  mobile: string;
  

  @IsOptional()
  @IsString()
  last_name: string;

  @IsString()
  gender: string;
  @IsDate()
  dob: Date;
  @IsDate()
  join_on:Date;
  @IsString()
  speciality:string;
  @IsString()
  qualification:string
  @IsString()
  experience:string;
  @IsNumber()
  salary:number;
  




  //Parent Information

}
