import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { USER_ROLE } from 'src/entities/user.entity';

export class NewGradeFeesDto {
  @IsString()
  grade: string;

  @IsNumber()
  total_quarters: number;

  @IsNumber()
  total_fees: number;
}
