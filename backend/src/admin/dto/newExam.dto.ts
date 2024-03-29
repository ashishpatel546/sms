import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class NewExamDto {
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

  // @IsDate()
  exam_date: string;

  @IsString()
  start_time: string;

  @IsString()
  duration: string;

  @IsOptional()
  @IsString()
  syllabus: string;
}
