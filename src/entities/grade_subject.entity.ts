import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'grade_subject' })
export class Grade_Subject{
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  grade_id: string;

  @Column({ nullable: false })
  subject_id: string;
}
