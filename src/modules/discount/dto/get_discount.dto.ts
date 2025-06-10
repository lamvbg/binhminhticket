import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "src/common/dtos/pageOption";

export class GetDiscountDto extends PageOptionsDto {
  @ApiPropertyOptional({ example: 'DISCOUNT20', description: 'Filter by discount code' })
  code?: string;
}