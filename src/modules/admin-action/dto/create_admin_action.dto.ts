import { ApiProperty } from "@nestjs/swagger";
import { ActionEnum } from "src/common/enum/enum";

export class CreateAdminActionDto {
  @ApiProperty({ example: '6933c706-3180-47a0-b56b-c98180d8afda', description: 'Admin user ID' })
  admin_id: string;

  @ApiProperty({ enum: ActionEnum, example: ActionEnum.APPROVE_ACCOUNT, description: 'Type of admin action' })
  action_type: ActionEnum;
}