import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enum/enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  password: string;

  @ApiProperty({ enum: RoleEnum, example: RoleEnum.USER })
  role: RoleEnum;

  @ApiProperty({ example: '0123456789' })
  phone: string;

  @ApiProperty({ example: 'SonTra, DaNang' })
  address: string;

  @ApiPropertyOptional({ example: 'DISCOUNT50' })
  discount_code?: string;
}
