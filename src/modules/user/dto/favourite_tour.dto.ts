// src/user/dto/favourite_tour.dto.ts

import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavouriteTourDto {
  @IsUUID()
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @IsUUID()
  @ApiProperty({ description: 'Tour ID to add or remove from favourites' })
  tourId: string;
}
