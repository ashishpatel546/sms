import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
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

export class NewStudentDto {
  //Personal Information
  @IsEmail()
  @IsEmailInDomain({ message: 'Email must be a school email' })
  email: string;

  // @IsString()
  // password: string;

  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsString()
  gender: string;

  @IsString()
  currentClass: string;

  @IsString()
  classSec: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2: string;

  @IsDate()
  dob: Date;

  //Parent Information

  @IsEmail()
  @IsEmailInDomain({ message: 'Email must be a school email' })
  parent_email: string;

  @IsString()
  father_name: string;

  @IsOptional()
  @IsString()
  father_email: string;
  
  @IsString()
  father_mobile: string;
  
  @IsOptional()
  @IsString()
  father_occupation: string;
  
  @IsOptional()
  @IsString()
  father_address: string;
  
  @IsString()
  mother_name: string;
  
  @IsOptional()
  @IsString()
  mother_email: string;
  
  
  @IsString()
  mother_mobile: string;
  
  @IsOptional()
  @IsString()
  mother_occupation: string;
  
  @IsOptional()
  @IsString()
  mother_address: string;

  //Admission Information
  @IsString()
  admissionID: string;

  @IsString()
  admissionDate: string;

  @IsString()
  admissionSession: string;

  @IsOptional()
  @IsString()
  prevSchool: string;

  // @IsBoolean()
  // is_active: boolean;
}
