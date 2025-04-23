import { Module } from '@nestjs/common';
import { AdminActionController } from './admin-action.controller';
import { AdminActionService } from './admin-action.service';

@Module({
  controllers: [AdminActionController],
  providers: [AdminActionService]
})
export class AdminActionModule {}
