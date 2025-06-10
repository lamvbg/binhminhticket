import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Tour } from "./tour.entity";
import { AbstractEntity } from "src/common/entities";

@Entity('cart')
export class Cart extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.cartItems)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Tour, tour => tour.cartItems)
  @JoinColumn({ name: 'tour_id', referencedColumnName: 'id' })
  tour: Tour;

  @Column()
  quantity: number;

  @Column('decimal')
  total_price: number;

  @Column({ nullable: true })
  discount_code: string;

    constructor(tour: Partial<Cart>) {
    super();
    Object.assign(this, tour);
  }
}
