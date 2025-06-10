import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tour_id: string;

  @ApiProperty({ required: false })
  tour_name?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  total_amount: number;
}
