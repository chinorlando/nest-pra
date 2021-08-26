import { Exclude } from "class-transformer";
import { Role } from "src/role/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
  @Exclude()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role)
  // @Joinolumn{name: role_id}
  @JoinColumn({name: 'role_id'})
  role: Role

}