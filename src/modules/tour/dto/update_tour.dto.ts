import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTourDto {
  @ApiPropertyOptional({ example: 'Amazing Thailand Tour' })
  name?: string;

  @ApiPropertyOptional({ example: 'Explore Bangkok, Phuket, and Chiang Mai' })
  description?: string;

  @ApiPropertyOptional({ example: 1000 })
  price?: number;

  @ApiPropertyOptional({ example: '2025-01-01' })
  start_date?: string;

  @ApiPropertyOptional({ example: '2025-01-10' })
  end_date?: string;

  @ApiPropertyOptional({ example: 20 })
  available_seats?: number;

  @ApiPropertyOptional({ example: 10 })
  duration?: number;
}
