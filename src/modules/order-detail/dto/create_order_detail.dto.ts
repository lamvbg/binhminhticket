import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsNumber } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({ example: 'tour-uuid', description: 'Tour ID being booked' })
  @IsUUID()
  tour_id: string;

  @ApiProperty({ example: 2, description: 'Quantity of tour booked' })
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 250000, description: 'Price per unit' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 500000,
    description: 'Total amount of the order in VND',
  })
  total_amount: number;
}
