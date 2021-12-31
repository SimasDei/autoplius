import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
