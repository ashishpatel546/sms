import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTimetableDto {
    @IsString()
    class:string;
    @IsString()
    section:string;
    @IsString()
    day:string;
    @IsNumber()
    period:number;
    @IsArray()
    subjects:string[];
   
    @IsArray()
    teacher_id:string[];
    
    

    
  }
  