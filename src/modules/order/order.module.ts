import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { Tour } from 'src/entities/tour.entity';
import { OrderDetail } from 'src/entities/order_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Tour, OrderDetail])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
