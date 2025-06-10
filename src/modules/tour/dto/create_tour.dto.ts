import { ApiProperty } from '@nestjs/swagger';

export class CreateTourDto {
  @ApiProperty({ example: 'Amazing Thailand Tour' })
  name: string;

  @ApiProperty({ example: 'Explore Bangkok, Phuket, and Chiang Mai' })
  description: string;

  @ApiProperty({ example: 1000 })
  price: number;

  @ApiProperty({ example: '2025-01-01' })
  start_date: Date;

  @ApiProperty({ example: '2025-01-10' })
  end_date: Date;

  @ApiProperty({ example: 20 })
  available_seats: number;

  @ApiProperty({ example: 10 })
  duration: number;
}
