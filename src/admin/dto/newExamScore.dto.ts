import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class NewExamScoreDto {
  @IsString()
  exam_name: string;

  @IsString()
  acad_year: string;

  @IsString()
  grade: string;

  @IsOptional()
  @IsString()
  section: string;

  @IsString()
  subject: string;

  @IsArray()
  student_id: Array<string>;

  @IsArray()
  obtained_marks: Array<number>;

  @IsNumber()
  maximum_marks: number;


}
