import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @Column({
    default: true,
  })
  admin: boolean;

  @AfterInsert()
  logInsert() {
    console.log('User inserted 💾 id:', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User updated 💾 id:', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User removed 🗑 id:', this.id);
  }
}
