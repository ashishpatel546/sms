// user.entity.ts

import { run } from 'node:test';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { Parent } from './parent.entity';

@Entity({ name: 'student' })
export class Student {
  @PrimaryGeneratedColumn({
  //   type:'int',
  //   name:'roll_number',
  //   transformer:{
  //     to:
  //   },
  //  // generated:'increment',
    
  })
  roll_number: number;

  @PrimaryColumn({ nullable: false })
  student_id: string;

  @Column({ nullable: false })
  created_on: Date;

  @Column({ nullable: false })
  updated_on: Date;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: false })
  gender: string;

  @Column({ nullable: false })
  currentClass: string;

  @Column({ nullable: false })
  classSec: string;

  @Column({ nullable: false })
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column({ nullable: false })
  dob: Date;

  @Column({ nullable: false, unique: true })
  admissionID: string;

  @Column({ nullable: false })
  admissionDate: string;

  @Column({ nullable: false })
  admissionSession: string;

  @Column({ nullable: true })
  prevSchool: string;

  // @Column({ type: 'varchar', nullable: false })
  // role: USER_ROLE;

  @Column({ default: false })
  is_active: boolean;

  // @OneToOne((type) => Parent, (parentTableRelation) => parentTableRelation.parent_student_id)
  //   parentTableRelation: Parent;
}
