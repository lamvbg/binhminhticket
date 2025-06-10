import { ApiProperty } from "@nestjs/swagger";
import { OrderEnum } from "src/common/enum/enum";
import { OrderDetailResponseDto } from "src/modules/order-detail/dto/order_detail_response.dto";

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: OrderEnum })
  status: OrderEnum;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: [OrderDetailResponseDto] })
  orderDetails: OrderDetailResponseDto[];
}