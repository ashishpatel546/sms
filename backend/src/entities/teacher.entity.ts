import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';
@Entity({ name: 'teacher' })
export class Teacher {
  @PrimaryColumn({ nullable: false })
  teacher_id: string;
  @Column({ nullable: false })
  join_on: Date;
  @Column({ nullable: false })
  email: string;
  @Column({ nullable: false })
  password: string;
  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;
  @Column({ nullable: false })
  created_on: Date;

  @Column({ nullable: false })
  updated_on: Date;
  @Column({ nullable: false })
  dob: Date;
  @Column({nullable:false})
  mobile:string;
  @Column({nullable:false})
  speciality:string;
  @Column({nullable:false})
  qualification:string;
  @Column({default:null})
  class_id:string;
  @Column({nullable:false})
  salary:number;
  @Column({nullable:false})
  experience:string;
 
  @Column({default:false})
  classTeacher:boolean;
@Column({nullable:false})
  gender: string;
  @Column({ default: false })
  is_active: boolean;
}
