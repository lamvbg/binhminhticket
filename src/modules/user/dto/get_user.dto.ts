import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { RoleEnum } from 'src/common/enum/enum';

export class GetUserDto extends PageOptionsDto {
  @ApiPropertyOptional({ example: RoleEnum.USER })
  role?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'John' })
  name?: string;

  @ApiPropertyOptional({ example: '0123456789' })
  phone?: string;

  @ApiPropertyOptional({ example: 'SonTra, DaNang' })
  address?: string;
}
