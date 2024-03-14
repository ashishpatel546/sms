import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'exam' })
export class Exam {
  @PrimaryColumn()
  exam_id: string;

  @Column({ nullable: false })
  exam_name: string;

  @Column({ nullable: false })
  acad_year: string;

  @Column({ nullable: false })
  grade_id: string;

  @Column({ nullable: true })
  class_id: string;

  @Column({ nullable: false })
  subject_id: string;

  @Column({ nullable: false })
  exam_date: Date;

  @Column({ nullable: false })
  start_time: string;

  @Column({ nullable: false })
  duration: string;

  @Column({ nullable: false })
  syllabus: string;
}
