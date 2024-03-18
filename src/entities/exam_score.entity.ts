import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'exam_score' })
export class Exam_Score {
  @PrimaryColumn()
  score_id: string;

  @Column({ nullable: false })
  exam_id: string;

  @Column({ nullable: false })
  grade_id: string;
  
  @Column({ nullable: false })
  student_id: string;

  @Column({ nullable: false })
  obtained_marks: number;

  @Column({ nullable: false })
  maximum_marks: number;

  @Column({ nullable: false })
  obtained_grade: string;
}
