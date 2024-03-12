import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'class_student' })
export class Class_Student{
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  classroom_id: string;

  @Column({ nullable: false })
  student_id: string;
}
