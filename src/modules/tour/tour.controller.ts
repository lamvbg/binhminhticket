import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/create_tour.dto';
import { GetToursDto } from './dto/get_tours.dto';
import { UpdateTourDto } from './dto/update_tour.dto';
import { ApiBody, ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'price',
        'start_date',
        'end_date',
        'available_seats',
        'duration',
      ],
      properties: {
        name: { type: 'string', example: 'Amazing Thailand Tour' },
        description: { type: 'string', example: 'Explore Bangkok, Phuket' },
        price: { type: 'number', example: 1000 },
        sale_percentage: { type: 'number', example: 5 },
        start_date: { type: 'string', format: 'date', example: '2025-01-01' },
        end_date: { type: 'string', format: 'date', example: '2025-01-10' },
        available_seats: { type: 'number', example: 20 },
        duration: { type: 'number', example: 10 },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Tour created successfully' })
  async create(
    @Body() createTourDto: CreateTourDto,
    @UploadedFiles() files: { images?: Multer.File[] },
  ) {
    return this.tourService.create(createTourDto, files.images || []);
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Amazing Thailand Tour' },
        description: { type: 'string', example: 'Explore Bangkok...' },
        price: { type: 'number', example: 1000 },
        duration: { type: 'number', example: 10 },
        sale_percentage: { type: 'number', example: 5 },
        start_date: { type: 'string', format: 'date', example: '2025-01-01' },
        end_date: { type: 'string', format: 'date', example: '2025-01-10' },
        available_seats: { type: 'number', example: 20 },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tour updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
    @UploadedFiles() files: { images?: Multer.File[] },
  ) {
    const result = await this.tourService.update(
      id,
      updateTourDto,
      files?.images || [],
    );
    return { result, message: 'Success' };
  }
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Tour deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}
