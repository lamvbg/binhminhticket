import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderDetail } from './order_detail.entity';
import { Cart } from './cart.entity';

@Entity()
export class Tour extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  duration: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  end_date: Date;

  @Column({ nullable: true })
  available_seats: number;

  @OneToMany(() => OrderDetail, (detail) => detail.tour)
  orderDetails: OrderDetail[];

  @OneToMany(() => Cart, (cart) => cart.tour)
  cartItems: Cart[];

  constructor(tour: Partial<Tour>) {
    super();
    Object.assign(this, tour);
  }
}
