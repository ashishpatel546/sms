// user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { Student } from './student.entity';

@Entity({ name: 'parent' })
export class Parent {

  @PrimaryColumn({nullable: false})
  parent_student_id: string;

  @Column({ nullable: false })
  created_on: Date;

  @Column({ nullable: false })
  updated_on: Date;

  @Column({ nullable: false, unique: true})
  parent_email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  father_name: string;

  @Column({ nullable: true })
  father_email: string;

  @Column({ nullable: false })
  father_mobile: string;

  @Column({ nullable: true })
  father_occupation: string;

  @Column({ nullable: true })
  father_address: string;

  @Column({ nullable: false })
  mother_name: string;

  @Column({ nullable: true })
  mother_email: string;

  @Column({ nullable: false })
  mother_mobile: string;
  
  @Column({ nullable: true })
  mother_occupation: string;
  
  @Column({ nullable: true })
  mother_address: string;

  @Column({ default: false })
  is_active: boolean;

  // @OneToOne((type) => Student, (parentTableRelation) => parentTableRelation.student_id)
  //   parentTableRelation: Student;
}
