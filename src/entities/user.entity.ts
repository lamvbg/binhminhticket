import { AbstractEntity } from 'src/common/entities';
import { RoleEnum } from 'src/common/enum/enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    nullable: false,
  })
  role: RoleEnum;

  @Column()
  discount_code: string;
}
