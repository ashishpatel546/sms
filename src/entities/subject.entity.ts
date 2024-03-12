import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'subject' })
export class Subject {
  @PrimaryColumn({ nullable: false })
  subject_id: string;

  @Column({ nullable: false })
  created_on: Date;

  @Column({ nullable: false })
  updated_on: Date;

  @Column({ nullable: false })
  subject_name: string;

  @Column({ nullable: true })
  description: string;
}
