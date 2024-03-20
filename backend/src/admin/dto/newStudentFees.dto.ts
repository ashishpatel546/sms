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


export class NewFeesDto {

  @IsString()
  student_id: string;

  @IsString()
  quarter: string;

  @IsNumber()
  paid_amt: number;

  @IsDate()
  payment_date: Date;

}