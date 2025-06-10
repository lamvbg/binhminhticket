import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CtvOrderService } from './ctv-order.service';
import { CreateCtvOrderDto } from './dto/create_ctv_order.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetCtvOrderDto } from './dto/get_ctv_order.dto';
import { UpdateCtvOrderDto } from './dto/update_ctv_order.dto';

@Controller('ctv-order')
export class CtvOrderController {
  constructor(private readonly ctvOrderService: CtvOrderService) {}

  @Post()
  @ApiBody({ type: CreateCtvOrderDto })
  @ApiResponse({ status: 201, description: 'CTV order created successfully' })
  async create(@Body() createCtvOrderDto: CreateCtvOrderDto) {
    return this.ctvOrderService.create(createCtvOrderDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAll(@Query() params: GetCtvOrderDto) {
    return this.ctvOrderService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  async get(@Param('id') id: string) {
    return this.ctvOrderService.get(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCtvOrderDto })
  @ApiResponse({ status: 200, description: 'CTV order updated successfully' })
  async update(@Param('id') id: string, @Body() updateCtvOrderDto: UpdateCtvOrderDto) {
    const result = await this.ctvOrderService.update(id, updateCtvOrderDto);
    return {result, message: 'Success'}
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'CTV order deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.ctvOrderService.remove(id);
  }
}
