import { Module } from '@nestjs/common';
import { CtvOrderService } from './ctv-order.service';
import { CtvOrderController } from './ctv-order.controller';

@Module({
  providers: [CtvOrderService],
  controllers: [CtvOrderController]
})
export class CtvOrderModule {}
