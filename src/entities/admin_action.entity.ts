import { AbstractEntity } from 'src/common/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ActionEnum } from 'src/common/enum/enum';

@Entity('admin_actions')
export class AdminAction extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.adminActions)
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column({
    type: 'enum',
    enum: ActionEnum,
    default: ActionEnum.APPROVE_ACCOUNT,
    nullable: false,
  })
  action_type: ActionEnum;

  constructor(tour: Partial<AdminAction>) {
    super();
    Object.assign(this, tour);
  }
}
