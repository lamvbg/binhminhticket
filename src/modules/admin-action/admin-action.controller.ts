import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminActionService } from './admin-action.service';
import { CreateAdminActionDto } from './dto/create_admin_action.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetAdminActionDto } from './dto/get_admin_action.dto';
import { UpdateAdminActionDto } from './dto/update_admin_action.dto';

@Controller('admin-action')
export class AdminActionController {
  constructor(private readonly adminActionService: AdminActionService) {}

  @Post()
  @ApiBody({ type: CreateAdminActionDto })
  @ApiResponse({
    status: 201,
    description: 'Admin action created successfully',
  })
  async create(@Body() createAdminActionDto: CreateAdminActionDto) {
    return this.adminActionService.create(createAdminActionDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAll(@Query() params: GetAdminActionDto) {
    return this.adminActionService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  async get(@Param('id') id: string) {
    return this.adminActionService.get(id);
  }

  @Patch('id')
  @ApiBody({ type: UpdateAdminActionDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async update(@Param('id') id: string, @Body() updateAdminActionDto: UpdateAdminActionDto) {
    const result = await this.adminActionService.update(id, updateAdminActionDto);
    return {result, message: 'Success'}
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  async remove(@Param('id') id: string) {
    return this.adminActionService.remove(id);
  }
}
