import { AbstractEntity } from 'src/common/entities';
import { OrderEnum } from 'src/common/enum/enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderDetail } from './order_detail.entity';
import { User } from './user.entity';
import { CtvOrder } from './ctv_order.entity';

@Entity()
export class Order extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.cartItems)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderEnum,
    default: OrderEnum.PENDING,
    nullable: false,
  })
  status: OrderEnum;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  orderDetails: OrderDetail[];

  @OneToMany(() => CtvOrder, ctvOrder => ctvOrder.order)
  ctvOrders: CtvOrder[];

  constructor(tour: Partial<Order>) {
    super();
    Object.assign(this, tour);
  }
}
