import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pageOption';

export class GetOrdersDto extends PageOptionsDto {
  @ApiPropertyOptional({ example: '6933c706-3180-47a0-b56b-c98180d8afda', description: 'Filter orders by user ID' })
  user_id?: number;

  @ApiPropertyOptional({ example: 'paid', description: 'Filter orders by status' })
  status?: string;
}
