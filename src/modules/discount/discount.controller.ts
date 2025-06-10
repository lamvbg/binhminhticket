import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateDiscountDto } from './dto/create_discount.dto';
import { GetDiscountDto } from './dto/get_discount.dto';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @ApiBody({ type: CreateDiscountDto })
  @ApiResponse({ status: 201, description: 'Discount created successfully' })
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of tours' })
  async findAll(@Query() params: GetDiscountDto) {
    return this.discountService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Discount found' })
  async findOne(@Param('id') id: string) {
    return this.discountService.get(id);
  }

  @Patch(':id')
  @ApiBody({ type: CreateDiscountDto })
  @ApiResponse({ status: 200, description: 'Discount updated successfully' })
  async update(@Param('id') id: string, @Body() updateDiscountDto: CreateDiscountDto) {
    const result = await this.discountService.update(id, updateDiscountDto);
    return { result, message: 'Success' };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Discount deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
