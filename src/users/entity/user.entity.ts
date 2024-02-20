// user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';
export enum USER_ROLE{
  student = 'STUDENT',
  parent = 'PARENT',  
  faculty = 'FACULTY',
  admin = 'ADMIN',
  superadmin = 'SUPER_ADMIN'
  
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, unique: true})
  email: string;

  @Column({nullable: false})
  password: string;

  @Column({nullable: false})
  first_name: string;

  @Column({nullable: true})
  last_name: string;
  
  @Column({nullable: true})
  mobile:string;

  
  @Column({ type: 'varchar', nullable: false })
  role: USER_ROLE;
}
