import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { OrderEnum } from 'src/common/enum/enum';
import { CreateOrderDetailDto } from 'src/modules/order-detail/dto/create_order_detail.dto';

export class CreateOrderDto {
  @ApiProperty({
    example: '6933c706-3180-47a0-b56b-c98180d8afda',
    description: 'User ID associated with the order',
  })
  user_id: string;

  @ApiProperty({
    example: 'pending',
    enum: OrderEnum,
    default: OrderEnum.PENDING,
    description: 'Current status of the order',
  })
  status: OrderEnum;

  @ApiProperty({
    description: 'List of order details',
    type: [CreateOrderDetailDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  @ArrayMinSize(1)
  orderDetails: CreateOrderDetailDto[];
}
