
import {
  Entity,
  Column,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'grade_fees' })
export class Grade_Fees {
  @Column({ nullable: false })
  created_on: Date;

  @Column({ nullable: false })
  updated_on: Date;

  @PrimaryColumn({ nullable: false })
  grade_id: string;

  @Column({ nullable: false })
  grade: string;

  @Column({ nullable: false })
  acad_year: string;

  @Column({ nullable: false })
  total_amount: number;

  @Column({ nullable: false, default: 4 })
  total_quarters: number;
}
