import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from 'src/entities/tour.entity';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { Discount } from 'src/entities/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tour, Discount])],
  controllers: [TourController],
  providers: [TourService, CloudinaryService]
})
export class TourModule {}
