import { AbstractEntity } from 'src/common/entities';
import { RoleEnum } from 'src/common/enum/enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Discount } from './discount.entity';
import { AdminAction } from './admin_action.entity';

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

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Discount, discount => discount.user)
  discounts: Discount[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Cart, cart => cart.user)
  cartItems: Cart[];

  @OneToMany(() => AdminAction, action => action.admin)
  adminActions: AdminAction[];

  constructor(tour: Partial<User>) {
    super();
    Object.assign(this, tour);
  }
}
