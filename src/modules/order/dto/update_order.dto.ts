import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { OrderEnum } from 'src/common/enum/enum';
import { CreateOrderDetailDto } from 'src/modules/order-detail/dto/create_order_detail.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 750000, description: 'Updated total amount of the order' })
  total_amount?: number;

  @ApiPropertyOptional({
    example: 'paid',
    enum: OrderEnum,
    default: OrderEnum.PENDING,
    description: 'Updated status of the order',
  })
  status?: OrderEnum

  @ApiPropertyOptional({
      description: 'List of order details',
      type: [CreateOrderDetailDto],
    })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderDetailDto)
    @ArrayMinSize(1)
    orderDetails?: CreateOrderDetailDto[];
}
