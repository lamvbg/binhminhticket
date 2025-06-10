import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create_order.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetOrdersDto } from './dto/get_orders.dto';
import { UpdateOrderDto } from './dto/update_order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of orders' })
  async getAll(@Query() params: GetOrdersDto) {
    return this.orderService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Order' })
  async findOne(@Param('id') id: string) {
    return this.orderService.get(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
      const result = await this.orderService.update(id, updateOrderDto);
      return { result, message: 'Success' };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
