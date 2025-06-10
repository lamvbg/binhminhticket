import { Module } from '@nestjs/common';
import { AdminActionController } from './admin-action.controller';
import { AdminActionService } from './admin-action.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAction } from 'src/entities/admin_action.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminAction, User])],
  controllers: [AdminActionController],
  providers: [AdminActionService]
})
export class AdminActionModule {}
