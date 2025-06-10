import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { AbstractEntity } from "src/common/entities";

@Entity('discounts')
export class Discount extends AbstractEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  discount_percentage: number;

  @Column()
  expiry_date: Date;

  @ManyToOne(() => User, user => user.discounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

    constructor(tour: Partial<Discount>) {
    super();
    Object.assign(this, tour);
  }
}
