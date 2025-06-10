import { ApiProperty } from "@nestjs/swagger";
import { CtvOrderStatus } from "src/common/enum/enum";

export class CreateCtvOrderDto {
  @ApiProperty({ example: '6933c706-3180-47a0-b56b-c98180d8afda', description: 'CTV user ID' })
  ctv_id: string;

  @ApiProperty({ example: '6933c706-3180-47a0-b56b-c98180d8afda', description: 'Order ID' })
  order_id: string;

  @ApiProperty({ example: 50.00, description: 'Commission amount earned' })
  commission_amount: number;

  @ApiProperty({ enum: CtvOrderStatus, example: CtvOrderStatus.PENDING, description: 'Commission status' })
  status: CtvOrderStatus;
}