import { IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from 'src/common/dtos/pageOption';

export class GetFavouriteDto extends PageOptionsDto {
  @IsUUID()
  userId: string;
}
