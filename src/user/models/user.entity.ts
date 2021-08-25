import { ValidationPipe } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({type: 'varchar', nullable: false})
  password: string;

  @Column({ default: true })
  isActive: boolean;

}