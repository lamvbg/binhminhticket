import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDiscountDto {
  @ApiPropertyOptional({ example: 'DISCOUNT20' })
  code?: string;
  @ApiPropertyOptional({
    example: 25,
    description: 'Updated discount percentage',
  })
  discount_percentage?: number;

  @ApiPropertyOptional({
    example: '2026-01-31',
    description: 'Updated expiry date',
  })
  expiry_date?: Date;
}
