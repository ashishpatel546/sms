import { IsArray, IsOptional, IsString } from 'class-validator';

export class NewClassDto {
  @IsString()
  grade: string;

  // @IsString()
  @IsArray()
  sections: string[];

  @IsArray()
  subjects: string[];

  @IsOptional()
  @IsString()
  classteacher_id: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  medium_of_teaching: string;

  @IsOptional()
  @IsString()
  academic_year: string;
}
