import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Discount } from 'src/entities/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Discount])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
