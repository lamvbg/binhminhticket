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
import { UserService } from './user.service';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create_user.dto';
import { GetUserDto } from './dto/get_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { FavouriteTourDto } from './dto/favourite_tour.dto';
import { GetFavouriteDto } from './dto/get_user_favourite_tour.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAll(@Query() params: GetUserDto) {
    return this.userService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User found' })
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.userService.update(id, updateUserDto);
    return { result, message: 'Success' };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('favourites/add')
  @ApiBody({ type: FavouriteTourDto })
  @ApiResponse({ status: 200, description: 'Tour added to favourites' })
  async addFavouriteTour(@Body() dto: FavouriteTourDto) {
    return this.userService.addFavouriteTour(dto.userId, dto.tourId);
  }

  @Post('favourites/remove')
  @ApiBody({ type: FavouriteTourDto })
  @ApiResponse({ status: 200, description: 'Tour removed from favourites' })
  async removeFavouriteTour(@Body() dto: FavouriteTourDto) {
    return this.userService.removeFavouriteTour(dto.userId, dto.tourId);
  }

  @Get('favourites/:userId')
  @ApiParam({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List favourite tours with pagination',
  })
  async getFavouriteTours(
    @Param('userId') userId: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.userService.getFavouriteTours({ userId, skip, take });
  }
}
