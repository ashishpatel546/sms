// attendance.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: string;
  @Column()
  student_name:string;
  @Column()
  class_id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean', default: true })
  isPresent: boolean;
}
