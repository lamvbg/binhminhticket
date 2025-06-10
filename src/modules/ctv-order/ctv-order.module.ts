import { Module } from '@nestjs/common';
import { CtvOrderService } from './ctv-order.service';
import { CtvOrderController } from './ctv-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Order } from 'src/entities/order.entity';
import { CtvOrder } from 'src/entities/ctv_order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CtvOrder, User, Order])],
  providers: [CtvOrderService],
  controllers: [CtvOrderController]
})
export class CtvOrderModule {}
