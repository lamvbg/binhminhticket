import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/create_tour.dto';
import { GetToursDto } from './dto/get_tours.dto';
import { UpdateTourDto } from './dto/update_tour.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @ApiBody({ type: CreateTourDto })
  @ApiResponse({ status: 201, description: 'Tour created successfully' })
  async create(@Body() createTourDto: CreateTourDto) {
    return this.tourService.create(createTourDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of tours' })
  async findAll(@Query() params: GetToursDto) {
    return this.tourService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Tour detail' })
  async findOne(@Param('id') id: string) {
    return this.tourService.get(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateTourDto })
  @ApiResponse({ status: 200, description: 'Tour updated successfully' })
  async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    const result = await this.tourService.update(id, updateTourDto);
    return { result, message: 'Success' };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Tour deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}
