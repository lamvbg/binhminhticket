import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Discount } from 'src/entities/discount.entity';
import { Tour } from 'src/entities/tour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Discount, Tour])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
