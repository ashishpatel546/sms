import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subject } from './subject.entity'; // Import Subject entity if it exists
import { Teacher } from './teacher.entity'; // Import Teacher entity if it exists

@Entity()
export class Time_table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string; 
  @Column()
  class: string;
  @Column()
  class_id: string;

  @Column()
  section: string;

  @Column()
  subjects: string;

  @Column()
  subject_id: string;

  @Column()
  period: number;

  @Column({nullable:false})
  teacher_id: string;

  //   @ManyToOne(() => Teacher, { eager: true })
  //   teacher: Teacher;
}
