import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { AbstractEntity } from 'src/common/entities';
import { CtvOrderStatus, OrderEnum } from 'src/common/enum/enum';

@Entity('ctv_orders')
export class CtvOrder extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ctv_id' })
  ctv: User;

  @ManyToOne(() => Order, (order) => order.ctvOrders)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column('decimal')
  commission_amount: number;

  @Column({
    type: 'enum',
    enum: CtvOrderStatus,
    default: CtvOrderStatus.PENDING,
    nullable: false,
  })
  status: CtvOrderStatus;

  constructor(tour: Partial<CtvOrder>) {
    super();
    Object.assign(this, tour);
  }
}
