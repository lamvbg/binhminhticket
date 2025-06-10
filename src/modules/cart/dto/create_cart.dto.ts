import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateCartDto {
  @ApiProperty({ example: '6933c706-3180-47a0-b56b-c98180d8afda', description: 'User ID' })
  user_id: string;

  @ApiProperty({ example: '6933c706-3180-47a0-b56b-c98180d8afda', description: 'Tour ID' })
  tour_id: string;

  @ApiProperty({ example: 2, description: 'Quantity of the tour' })
  quantity: number;

  @ApiProperty({ example: 399.98, description: 'Total price' })
  total_price: number;

  @ApiPropertyOptional({ example: 'DISCOUNT10', description: 'Discount code applied', required: false })
  discount_code?: string;
}
