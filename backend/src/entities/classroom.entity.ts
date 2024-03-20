import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'classroom' })
export class Classroom {
  @PrimaryColumn({ nullable: false })
  classroom_id: string;

  // @Column({ nullable: false, unique: false })
  // grade_id: string;

  @Column({ nullable: false })
  grade: string;

  @Column({ nullable: false })
  created_on: Date;

  @Column({ nullable: false })
  updated_on: Date;

  @Column({ nullable: false })
  section: string;

  @Column({ nullable: true, unique: true })
  classteacher_id: string;

  @Column({ nullable: true })
  medium_of_teaching: string;

  @Column({ nullable: true, unique: true })
  timetable_id: string;

  @Column({ nullable: true})
  academic_year: string;
}
