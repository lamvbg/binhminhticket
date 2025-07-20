import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from 'src/common/entities';
import { Tour } from './tour.entity';

@Entity('discounts')
export class Discount extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  discount_percentage: number;

  @Column()
  expiry_date: Date;
  
  @ManyToMany(() => User, (user) => user.discounts, { cascade: true })
  users: User[];

  constructor(tour: Partial<Discount>) {
    super();
    Object.assign(this, tour);
  }
}
