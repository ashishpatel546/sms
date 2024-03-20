import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'grade' })
export class Grade {
  @PrimaryColumn({ nullable: false })
  grade_id: string;

  @Column({ nullable: false })
  created_on: Date;

  @Column({ nullable: false })
  updated_on: Date;

  @Column({ nullable: false })
  grade: string;

  @Column({ nullable: true })
  description: string;
}
