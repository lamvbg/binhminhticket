import {ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enum/enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'strongPassword123' })
  password?: string;

  @ApiPropertyOptional({ enum: RoleEnum, example: RoleEnum.USER })
  role?: RoleEnum;

  @ApiPropertyOptional({ example: '0123456789' })
  phone?: string;

  @ApiPropertyOptional({ example: 'SonTra, DaNang' })
  address?: string;

  @ApiPropertyOptional({ example: 'DISCOUNT50' })
  discount_code?: string;
}
