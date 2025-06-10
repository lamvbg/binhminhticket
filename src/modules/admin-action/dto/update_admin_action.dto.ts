import { ApiPropertyOptional } from "@nestjs/swagger";
import { ActionEnum } from "src/common/enum/enum";

export class UpdateAdminActionDto {
  @ApiPropertyOptional({ example: '6933c706-3180-47a0-b56b-c98180d8afda', description: 'Admin user ID' })
  admin_id: string;

  @ApiPropertyOptional({ enum: ActionEnum, example: ActionEnum.APPROVE_ACCOUNT, description: 'Type of admin action' })
  action_type: ActionEnum;
}