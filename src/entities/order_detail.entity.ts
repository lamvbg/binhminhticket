import { AbstractEntity } from 'src/common/entities';
import { OrderEnum } from 'src/common/enum/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tour } from './tour.entity';
import { Order } from './order.entity';

@Entity('order_detail')
export class OrderDetail extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Tour, (tour) => tour.orderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  total_amount: number;
}
