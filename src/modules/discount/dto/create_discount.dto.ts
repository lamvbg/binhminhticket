import { ApiProperty } from "@nestjs/swagger";

export class CreateDiscountDto {
  @ApiProperty({ example: 'DISCOUNT20' })
  code: string;

  @ApiProperty({ example: 20, description: 'Percentage value of the discount' })
  discount_percentage: number;

  @ApiProperty({ example: '2025-12-31', description: 'ISO date format' })
  expiry_date: Date;

}